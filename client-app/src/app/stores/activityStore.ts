import {action, computed, configure, makeObservable, observable, runInAction} from "mobx";
import {createContext, SyntheticEvent} from "react";
import {IActivity} from "../model/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid";

configure({enforceActions: "always"});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable loadingInitial = false;
    @observable activity: IActivity | null = null;
    @observable submitting = false;
    @observable target = '';

    @computed get activitiesByDates() {
        return Array.from(this.activityRegistry.values()).slice().sort(((a, b) => Date.parse(a.date) - Date.parse(b.date)))
    }

    constructor() {
        makeObservable(this);
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach(activity => {
                    activity.date = activity.date.split('.')[0];
                    this.activityRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false
            });
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false
            });
            console.log(error);
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    this.activity = activity;
                    this.loadingInitial = false;
                })
            } catch (error) {
                runInAction(() => {
                    this.loadingInitial = false;
                });
                console.log(error);
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

        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            console.log(error);
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
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            });
            console.log(error);
        }
    }

    @action openEditForm = (id: string) => {
        this.activity = this.activityRegistry.get(id);
    }


    @action openCreateForm = () => {
        this.activity = null;
    }
}

export default createContext(new ActivityStore())