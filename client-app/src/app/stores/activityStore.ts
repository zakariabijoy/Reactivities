import { makeAutoObservable, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import agent from "../api/agent";
import { IActivity } from "./../models/activity";

configure({ enforceActions: "always" });

class ActivityStore {
  constructor() {
    makeAutoObservable(this);
  }

  //obserable
  activityRegistry = new Map();
  activities: IActivity[] = [];
  selectedActivity: IActivity | undefined = undefined;
  loadingInitial = false;
  editMode = false;
  submitting = false;
  target = "";

  //computeed
  get activitiesByDate() {
    return Array.from(this.activityRegistry.values())
      .slice(0)
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  // action
  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.activities.list();
      runInAction(() => {
        activities.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.loadingInitial = false;
      });
    }
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = false;
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.activities.create(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.submitting = false;
      });
    }
  };

  editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.activities.update(activity);
      runInAction(() => {
        this.activityRegistry.set(activity.id, activity);
        this.selectedActivity = activity;
        this.editMode = false;
        this.submitting = false;
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.submitting = false;
      });
    }
  };

  deleteActivity = async (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
    this.submitting = true;
    this.target = e.currentTarget.name;
    try {
      await agent.activities.delete(id);
      runInAction(() => {
        this.activityRegistry.delete(id);
        this.selectedActivity = undefined;
        this.submitting = false;
        this.target = "";
      });
    } catch (error) {
      console.log(error);
      runInAction(() => {
        this.submitting = false;
        this.target = "";
      });
    }
  };

  openCreateForm = () => {
    this.selectedActivity = undefined;
    this.editMode = true;
  };

  openEditMode = (id: string) => {
    this.selectedActivity = this.activityRegistry.get(id);
    this.editMode = true;
  };

  cancelSelectedActivity = () => {
    this.selectedActivity = undefined;
    this.editMode = false;
  };

  cancelFormOpen = () => {
    this.editMode = false;
  };
}

export default createContext(new ActivityStore());