import React, { useState, useEffect } from "react"
import { Container } from "semantic-ui-react";
import axios from "axios";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    axios
      .get<IActivity[]>("https://localhost:5001/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
  }, []);

  const handleSelectAcitvity = (id: string) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
  };

  const handleOpenCreateForm = ()=>{
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity : IActivity) =>{
    setActivities([...activities, activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  
  const handleEditActivity = (activity : IActivity) =>{
    setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
  }

  return (
    <React.Fragment>
      <NavBar openCreateForm ={handleOpenCreateForm} />
      <Container style={{ marginTop: "7em" }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectAcitvity}
          selectedActivity={selectedActivity}
          setSelectedActivity ={setSelectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          createActivity = {handleCreateActivity}
          editActivity = {handleEditActivity}
        />
      </Container>
    </React.Fragment>
  );
};

export default App;
