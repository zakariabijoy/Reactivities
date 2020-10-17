import React, { useState, useEffect } from "react";
import { Container, List } from "semantic-ui-react";
import axios from "axios";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([]);

  useEffect(() => {
    axios
      .get<IActivity[]>("https://localhost:5001/api/activities")
      .then((response) => {
        setActivities(response.data);
      });
  }, []);

  return (
      <React.Fragment>
      <NavBar />
      <Container style={{marginTop: '7em'}}>
        <List>
          {activities.map((activity) => (
            <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List>
      </Container>
      </React.Fragment>
  );
};

export default App;
