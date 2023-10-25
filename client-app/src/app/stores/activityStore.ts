import { makeAutoObservable, runInAction} from "mobx"
import { Activity } from "../models/activity"
import agent from "../api/agent";
import { format } from "date-fns";
import { store } from "./store";
import { Profile } from "../models/profile";

export default class ActivityStore{
    activityRegistry = new Map<string, Activity>();
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        makeAutoObservable(this)
    }

    get activitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
            a.date!.getTime() - b.date!.getTime());
    }

    get groupedAcivities(){
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) =>{
                const date = format(activity.date!, 'dd MMM yyyy')
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            },{} as {[key:string] : Activity[]})
        )
    }
    loadActivities = async () =>{
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach(activity =>{
                this.setActivity(activity);
            })
            this.setLoadingInitial(false);
            
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    loadActivity = async (id: string) =>{
        let activity =  this.getActivity(id);
        if(activity) {
            this.selectedActivity = activity;
            return activity;
        }
        else {
            this.setLoadingInitial(true);
            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => this.selectedActivity = activity);
                this.setLoadingInitial(false);
                return activity;
            } catch (error) {
                console.log(error);
                this.setLoadingInitial(false);
            }
        }
    }

    private getActivity = (id: string) =>{
        return this.activityRegistry.get(id);
    }

    private setActivity = (activity: Activity) =>{
        const user = store.userStore.user;
        if(user){
            activity.isGoing = activity.attendees!.some(a => a.username === user.username );
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
        }
        activity.date = new Date(activity.date!)
        this.activityRegistry.set(activity.id, activity);
    }

    setLoadingInitial = (state: boolean) =>{
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) =>{
        this.loading = true;
        try {
            await agent.Activities.create(activity);
            runInAction(() =>{
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() =>{
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) =>{
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() =>{
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() =>{
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) =>{
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() =>{
                this.activityRegistry.delete(id);
                this.loading = false;
            })

        } catch (error) {
            console.log(error);
            runInAction(() =>{
                this.loading = false;
            })
        }
    }

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() =>{
                if(this.selectedActivity?.isGoing){
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                }else{
                    const attendee = new Profile(user!); 
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error);
        }finally{
            runInAction(() => this.loading = false);
        }
    }
}