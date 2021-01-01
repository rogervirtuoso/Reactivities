import {action, computed, configure, makeObservable, observable, runInAction} from "mobx";
import {createContext, SyntheticEvent} from "react";
import {IActivity} from "../model/activity";
import agent from "../api/agent";
import {v4 as uuid} from "uuid";

configure({enforceActions: "always"});

class ActivityStore {
    @observable activityRegistry = new Map();
    @observable activities: IActivity[] = [];
    @observable loadingInitial = false;
    @observable selectedActivity: IActivity | undefined;
    @observable editMode = false;
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

    @action selectActivity = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = false;
    }

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            activity.id = uuid();
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.editMode = false;
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
                this.editMode = false;
                this.selectedActivity = undefined;
            });

        } catch (error) {
            runInAction(() => {
                this.submitting = false;
                this.target = '';
                this.editMode = false
                this.selectedActivity = undefined;
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
                this.selectedActivity = activity;
                this.editMode = false;
            });
        } catch (error) {
            runInAction(() => {
                this.editMode = false;
                this.submitting = false;
            });
            console.log(error);
        }
    }

    @action openEditForm = (id: string) => {
        this.selectedActivity = this.activityRegistry.get(id);
        this.editMode = true;
    }

    @action cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    @action cancelFormOpen = () => {
        this.editMode = false;
    }

    @action openCreateForm = () => {
        this.editMode = true;
        this.selectedActivity = undefined;
    }
}

export default createContext(new ActivityStore())