import { action, makeObservable, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
    
    // initials properties
    //activities: Activity[] = [];
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false; // is submiting
    loadingInitial = true;

    constructor() {
        makeObservable(this, {
            // observe properties
            //activities: observable,
            selectedActivity: observable,
            editMode: observable,
            loading: observable,
            loadingInitial: observable,
            // observe action
            loadActivities: action,
            setLoadingInitial: action,
            selectActivity: action,
            cancelSelectedActivity: action,
            createActivity: action,
            updateActivity: action,
            deleteActivity: action,
            setLoading: action,          
        })
    }

    // COMUTED PROPERTIES
    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a,b) => Date.parse(a.date) - Date.parse(b.date));
    }

    // ACTIONS
    loadActivities = async () => {
        try {
            const activities = await agent.Activities.list();
            // runInAction(() => {
            //     activities.forEach(activity => {
            //         activity.date = activity.date.split('T')[0];
            //         this.activities.push(activity);
            //     });
            // })
            activities.forEach(activity => {
                  activity.date = activity.date.split('T')[0];
                  //this.activities.push(activity);
                  this.activityRegistry.set(activity.id, activity);
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
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    /* GET methodes */

    // handle when select specific Activity from list
    selectActivity = (id: string) => {
        //this.selectedActivity = this.activities.find(x => x.id === id);
        this.selectedActivity = this.activityRegistry.get(id);
    }
    // handle cancel choosen Activity
    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }
    // edit choosen Activity
    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }
    // handle form to be closed 
    closeForm = () => {
        this.editMode = false;
    }

    /* POST  */

    // handle create or edit activty
    createActivity = async (activity: Activity) => {
        this.setLoading(true)
        activity.id = uuid();
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
            if(this.selectedActivity?.id === id) this.cancelSelectedActivity();
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