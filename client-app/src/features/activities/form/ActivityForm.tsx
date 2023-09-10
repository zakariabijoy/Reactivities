import { Button, Form, Segment } from "semantic-ui-react";

export default function ActivityForm(){
    return (
        <Segment clearing>
            <Form>
                <Form.Input placeholder="Title"/>
                <Form.Input placeholder="Description"/>
                <Form.Input placeholder="Category"/>
                <Form.Input placeholder="Date"/>
                <Form.Input placeholder="City"/>
                <Form.Input placeholder="Venue"/>
                <Button floated="right" positive type="submit" content='Submit'/>
                <Button floated="right" positive type="button" content='Cancel'/>
            </Form>
        </Segment>
    )
}