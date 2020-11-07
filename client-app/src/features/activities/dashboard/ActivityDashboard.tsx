import React from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";

const ActivityDashboard: React.FC = () => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Activiy Filter Menu</h2>
      </Grid.Column>
    </Grid>
  );
};
export default observer(ActivityDashboard);
