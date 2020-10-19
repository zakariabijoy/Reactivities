import React from "react";
import { Button, Form, Segment } from "semantic-ui-react";

interface IProps {
  setEditMode: (editMode: boolean) => void;
}

const ActivityForm: React.FC<IProps> = ({setEditMode}) => {
  return (
      <Segment clearing>
          <Form>
          <Form.Input placeholder='Title' />
          <Form.TextArea rows={2} placeholder='Description' />
          <Form.Input placeholder='Category' />
          <Form.Input type="date" placeholder='Date' />
          <Form.Input placeholder='City' />
          <Form.Input placeholder='Venue' />
          <Button floated="right" positive type="submit" content="Submit"/>
          <Button onClick={() => setEditMode(false) } floated="right"  type="submit" content="Cancel"/>
          </Form>
      </Segment>
  );
};

export default ActivityForm;
