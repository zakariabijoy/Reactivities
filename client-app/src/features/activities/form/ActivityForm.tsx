import React, { useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface IProps {
  activity: IActivity;
  setEditMode: (editMode: boolean) => void;
}

const ActivityForm: React.FC<IProps> = ({
  setEditMode,
  activity: InitialFormState,
}) => {
  const initializeForm = () => {
    if (InitialFormState) {
      return InitialFormState;
    } else {
      return {
        id: "",
        title: "",
        description: "",
        category: "",
        date: "",
        city: "",
        venue: "",
      };
    }
  };

  const [activity, setactivity] = useState<IActivity>(initializeForm);

  return (
    <Segment clearing>
      <Form>
        <Form.Input placeholder="Title" value={activity.title} />
        <Form.TextArea rows={2} placeholder="Description" value={activity.description} />
        <Form.Input placeholder="Category" value={activity.category} />
        <Form.Input type="date" placeholder="Date" value={activity.date} />
        <Form.Input placeholder="City" value={activity.city} />
        <Form.Input placeholder="Venue" value={activity.venue} />
        <Button floated="right" positive type="submit" content="Submit" />
        <Button
          onClick={() => setEditMode(false)}
          floated="right"
          type="submit"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default ActivityForm;
