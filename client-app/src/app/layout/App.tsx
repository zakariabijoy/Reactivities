import React, { useState, useEffect } from "react"
import { Container } from "semantic-ui-react";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent'


const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  
  const handleSelectAcitvity = (id: string) => {
    setSelectedActivity(activities.filter((a) => a.id === id)[0]);
  };

  const handleOpenCreateForm = ()=>{
    setSelectedActivity(null);
    setEditMode(true);
  }

  const handleCreateActivity = (activity : IActivity) =>{
    agent.activities.create(activity).then(()=>{
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    });
  }

  
  const handleEditActivity = (activity : IActivity) =>{
    agent.activities.update(activity).then(()=>{
      setActivities([...activities.filter(a => a.id !== activity.id), activity]);
    setSelectedActivity(activity);
    setEditMode(false);
    });
  }

  const handleDeleteActivity = (id : string) =>{
    agent.activities.delete(id).then(()=>{
      setActivities([...activities.filter(a => a.id !== id)]);
    });
  }

  useEffect(() => {
    agent.activities.list()
      .then((response) => {
        let activities: IActivity[] = [];
        response.forEach((activity) => {
          activity.date = activity.date.split('.')[0];
          activities.push(activity);
        });
        setActivities(activities);
      }).then(()=> setLoading(false));
  }, []);

  if(loading) return (<LoadingComponent content='Loading Activities...'/>);

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
          deleteActivity = {handleDeleteActivity}
        />
      </Container>
    </React.Fragment>
  );
};

export default App;
