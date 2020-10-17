import React, { useState, useEffect } from "react";
import { Container} from "semantic-ui-react";
import axios from "axios";
import { IActivity } from "../models/activity";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

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
        <ActivityDashboard activities={activities} />
      </Container>
      </React.Fragment>
  );
};

export default App;
