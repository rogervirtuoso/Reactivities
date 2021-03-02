import {action, computed, makeObservable, observable, reaction, runInAction} from "mobx";
import {SyntheticEvent} from "react";
import {IActivity, IAttendee} from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid";
import {history} from "../../index";
import {toast} from "react-toastify";
import {RootStore} from "./rootStore";
import {createAttendee, setActivityProps} from "../common/util/util";
import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";

const LIMIT = 2;

export default class ActivityStore {

    rootStore: RootStore;

    @observable activityRegistry = new Map();
    @observable loadingInitial = false;
    @observable activity: IActivity | null = null;
    @observable submitting = false;
    @observable target = '';
    @observable loading = false
    @observable.ref hubConnection: HubConnection | null = null;
    @observable activityCount = 0
    @observable page = 0
    @observable predicate = new Map();

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore

        reaction(
            () => this.predicate.keys(),
            () => {
                this.page = 0;
                this.activityRegistry.clear();
                this.loadActivities();
            })
    }

    @action setPredicate = (predicate: string, values: string | Date) => {
        this.predicate.clear();
        if (predicate !== 'all') {
            this.predicate.set(predicate, values);
        }
    }

    @computed get axiosParams() {
        const params = new URLSearchParams();
        params.append('limit', String(LIMIT));
        params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, value.toISOString());
            } else {
                params.append(key, value);
            }
        });
        return params;
    }

    @computed get totalPages() {
        return Math.ceil(this.activityCount / LIMIT);
    }

    @action setPage = (page: number) => {
        this.page = page;
    }

    @action createHubConnection = (activityId: string) => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_API_CHAT_URL!.toString(), {
                accessTokenFactory: () => this.rootStore.commonStore.token!
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();

        if (this.hubConnection.state === 'Disconnected') {
            this.hubConnection
                .start()
                .then(() => console.log(this.hubConnection!.state))
                .then(() => {
                    if (this.hubConnection?.state === "Connected") {
                        console.log('Attempting to join group');
                        this.hubConnection?.invoke('AddToGroup', activityId);
                    }
                })
                .catch((error) =>
                    console.log('Error establishing connection: ', error)
                );
        }

        this.hubConnection.on('ReceiveComment', comment => {
            runInAction(() => {
                this.activity!.comments.push(comment);
            })
        });

        this.hubConnection.on('Send', message => {
            toast.info(message);
        })
    };

    @action stopHubConnection = () => {
        if (this.hubConnection?.state === "Connected") {
            this.hubConnection!.invoke("RemoveFromGroup", this.activity!.id)
                .then(() => {
                    this.hubConnection!.stop();
                })
                .then(() => console.log("Connection stopped"))
                .catch((err) => console.log("error", err));
        }
    };

    @action addComment = async (values: any) => {
        if (this.hubConnection?.state === "Connected") {

            values.activityId = this.activity!.id;

            try {
                await this.hubConnection!.invoke('SendComment', values);
            } catch (error) {
                console.log(error);
            }
        }
    }


    @computed get activitiesByDates() {
        return this.groupActivitiesByDates(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDates(activities
                               :
                               IActivity[]
    ) {
        const sortedActivities = activities
            .sort(
                ((a, b) => a.date.getTime() - b.date.getTime())
            )

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];

            return activities;
        }, {} as { [key: string]: IActivity[] }));
    }

    @action
    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
            const {activities, activityCount} = activitiesEnvelope;
            runInAction(() => {
                activities.forEach(activity => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activityRegistry.set(activity.id, activity);
                });
                this.activityCount = activityCount;
                this.loadingInitial = false
            });
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false
            });
        }
    }

    @action
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    this.activity = setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })
                return activity;
            } catch (error) {
                runInAction(() => {
                    this.loadingInitial = false;
                })
            }
        }
    }

    @action
    clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }


    @action
    createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            activity.id = uuid();
            await agent.Activities.create(activity);
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees: IAttendee[] = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.comments = [];
            activity.isHost = true;
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            })
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error.response);
        }
    }

    @action
    deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        try {
            this.target = event.currentTarget.name;
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
                this.activity = null;
            });

        } catch (error) {
            runInAction(() => {
                this.submitting = false;
                this.target = '';
                this.activity = null;
            });
            console.log(error);
        }
    }

    @action
    editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            });
            history.push(`/activities/${activity.id}`)
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            toast.error('Problem submitting data');
            console.log(error.response);
        }
    }

    @action
    openEditForm = (id: string) => {
        this.activity = this.activityRegistry.get(id);
    }


    @action
    openCreateForm = () => {
        this.activity = null;
    }

    @action
    attendActivity = async () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;
        try {
            await agent.Activities.attendee(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
            toast.error('Problem signing up to activity')
        }
    }

    @action
    cancelAttendance = async () => {
        this.loading = true;
        try {
            await agent.Activities.unattend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees = this.activity.attendees.filter(a => a.username !== this.rootStore.userStore.user!.userName)

                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error('Problem canceling attendence')
        }
    }
}
