import { action, makeAutoObservable, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";

export default class ActivityStore {
    
    // initials properties
    //activities: Activity[] = [];
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false; // is submiting
    loadingInitial = true;

    constructor() {
       makeAutoObservable(this)
    }

    // COMUTED PROPERTIES
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }

    // ACTIONS
    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            // runInAction(() => {
            //     activities.forEach(activity => {
            //         activity.date = activity.date.split('T')[0];
            //         this.activities.push(activity);
            //     });
            // })
            activities.forEach(activity => {
                this.setActivity(activity);
            });
            
            this.setLoadingInitial(false)
            //this.loadingInitial = false;
        } catch (error) {
            console.log(error);
            // runInAction(() => {
            //     this.loadingInitial = false;
            // })
            this.setLoadingInitial(false);
            
        }
    }

    loadingActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if(activity) {
            this.selectedActivity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                this.selectedActivity = activity;
                this.setLoadingInitial(false);
                return activity
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        //this.activities.push(activity);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    /* POST  */

    // handle create or edit activty
    createActivity = async (activity: Activity) => {
        this.setLoading(true);
        try {
            await agent.Activities.create(activity);
            // runInAction(() => {
                //this.activities.push(activity);
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.setLoading(false);
           // })
        } catch (error) {
            console.log(error);
            //runInAction(() => {
                this.setLoading(false);
           // })
        }
    }
    /* UPDATE */
    updateActivity = async(activity: Activity) => {
        this.setLoading(true);
        try {
            await agent.Activities.update(activity);
            //this.activities = [...this.activities.filter(x => x.id !== activity.id), activity];
            this.activityRegistry.set(activity.id, activity);
            this.selectedActivity = activity;
            this.editMode = false;
            this.setLoading(false);
        } catch (error) {
            console.log(error);
            this.setLoading(false);
        }
    }
    /* DELETE */
    // handle delete actvity from list
    deleteActivity = async(id: string) => {
        this.setLoading(true);
        try {
            await agent.Activities.delete(id);
            //this.activities = [...this.activities.filter(x => x.id !== id)];
            this.activityRegistry.delete(id);
            this.setLoading(false);
        } catch (error) {
            console.log(error);
            this.setLoading(false);
        }
    }
    setLoading = (state: boolean) => {
        this.loading = state;
    }

}