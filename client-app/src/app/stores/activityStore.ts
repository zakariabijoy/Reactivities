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

  loadActivities = () => {
    this.loadingInitial = true;
    agent.activities
      .list()
      .then((activites) => {
        activites.forEach((activity) => {
          activity.date = activity.date.split(".")[0];
          this.activities.push(activity);
        });
      })
      .finally(() => (this.loadingInitial = false));
  };

  selectActivity = (id: string) => {
    this.selectedActivity = this.activities.find((a) => a.id === id);
  };
}

export default createContext(new ActivityStore());
