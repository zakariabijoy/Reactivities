import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import agent from "../api/agent";
import { IActivity } from "./../models/activity";

class ActivityStore {
  constructor() {
    makeAutoObservable(this);
  }

  //obserable
  activities: IActivity[] = [];
  selectedActivity: IActivity | undefined = undefined;
  loadingInitial = false;
  editMode = false;
  submitting = false;

  //computeed
  get activitiesByDate() {
    return this.activities
      .slice(0)
      .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  }

  // action
  loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.activities.list();
      activities.forEach((activity) => {
        activity.date = activity.date.split(".")[0];
        this.activities.push(activity);
      });
      this.loadingInitial = false;
    } catch (error) {
      console.log(error);
      this.loadingInitial = false;
    }
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find((a) => a.id === id);
  };

  createActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.activities.create(activity);
      this.activities.push(activity);
      this.selectedActivity = activity;
      this.editMode = false;
      this.submitting = false;
    } catch (error) {
      console.log(error);
      this.submitting = false;
    }
  };

  openCreateForm = () => {
    this.selectedActivity = undefined;
    this.editMode = true;
  };
}

export default createContext(new ActivityStore());
