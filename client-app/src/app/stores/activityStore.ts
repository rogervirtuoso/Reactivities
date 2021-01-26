import {action, computed, configure, makeObservable, observable, runInAction} from "mobx";
import {SyntheticEvent} from "react";
import {IActivity} from "../models/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid";
import {history} from "../../index";
import {toast} from "react-toastify";
import {RootStore} from "./rootStore";

export default class ActivityStore {

    rootStore: RootStore;

    @observable activityRegistry = new Map();
    @observable loadingInitial = false;
    @observable activity: IActivity | null = null;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDates() {
        return this.groupActivitiesByDates(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDates(activities: IActivity[]) {
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

    constructor(rootStore: RootStore) {
        makeObservable(this);
        this.rootStore = rootStore
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach(activity => {
                    activity.date = new Date(activity.date);
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false
            });
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false
            });
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    activity.date = new Date(activity.date);
                    this.activity = activity;
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

    @action clearActivity = () => {
        this.activity = null;
    }

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }


    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            activity.id = uuid();
            await agent.Activities.create(activity);
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

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
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

    @action editActivity = async (activity: IActivity) => {
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

    @action openEditForm = (id: string) => {
        this.activity = this.activityRegistry.get(id);
    }


    @action openCreateForm = () => {
        this.activity = null;
    }
}
