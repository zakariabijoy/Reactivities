import { makeAutoObservable } from "mobx";
import { createContext } from "react";
import agent from "../api/agent";
import { IActivity } from "./../models/activity";

class ActivityStore {
  /**
   *
   */
  constructor() {
    makeAutoObservable(this);
  }
  activities: IActivity[] = [];
  selectedActivity: IActivity | undefined = undefined;
  loadingInitial = false;
  editMode = false;

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
}

export default createContext(new ActivityStore());
