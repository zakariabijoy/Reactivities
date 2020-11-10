import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { match, RouteComponentProps } from "react-router-dom";

interface matchParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<matchParams>> = ({
  match,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    cancelFormOpen,
    activity: InitialFormState,
    loadActivity,
  } = activityStore;

  useEffect(() => {
    if (match.params.id) {
      loadActivity(match.params.id).then(
        () => InitialFormState && setactivity(InitialFormState)
      );
    }
  });

  const [activity, setactivity] = useState<IActivity>({
    id: "",
    title: "",
    description: "",
    category: "",
    date: "",
    city: "",
    venue: "",
  });

  const handleSubmit = () => {
    if (activity.id.length > 0) {
      editActivity(activity);
    } else {
      let newActivity = {
        ...activity,
        id: uuid(),
      };
      createActivity(newActivity);
    }
  };

  const handleInputChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.currentTarget;
    setactivity({ ...activity, [name]: value });
  };

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input
          onChange={handleInputChange}
          name="title"
          placeholder="Title"
          value={activity.title}
        />
        <Form.TextArea
          rows={2}
          onChange={handleInputChange}
          name="description"
          placeholder="Description"
          value={activity.description}
        />
        <Form.Input
          onChange={handleInputChange}
          name="category"
          placeholder="Category"
          value={activity.category}
        />
        <Form.Input
          onChange={handleInputChange}
          name="date"
          type="datetime-local"
          placeholder="Date"
          value={activity.date}
        />
        <Form.Input
          onChange={handleInputChange}
          name="city"
          placeholder="City"
          value={activity.city}
        />
        <Form.Input
          onChange={handleInputChange}
          name="venue"
          placeholder="Venue"
          value={activity.venue}
        />
        <Button
          loading={submitting}
          floated="right"
          positive
          type="submit"
          content="Submit"
        />
        <Button
          onClick={cancelFormOpen}
          floated="right"
          type="submit"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);
