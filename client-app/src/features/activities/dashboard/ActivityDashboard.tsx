import React from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  selectedActivity: IActivity | null;
  setSelectedActivity: (activity: IActivity | null) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  selectedActivity,
  setSelectedActivity,
  editMode,
  setEditMode,
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList activities={activities} selectActivity={selectActivity} setEditMode={setEditMode} />
      </Grid.Column>
      <Grid.Column width={6}>
        {selectedActivity && (
          <ActivityDetails
            activity={selectedActivity}
            setEditMode={setEditMode}
            setSelectedActivity = {setSelectedActivity}
          />
        )}

        {editMode && <ActivityForm  setEditMode={setEditMode}/>}        
      </Grid.Column>
    </Grid>
  );
};

export default ActivityDashboard;
