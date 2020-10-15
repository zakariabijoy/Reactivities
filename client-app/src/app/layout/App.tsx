import React, { Component } from "react";
import { Header, Icon, List } from "semantic-ui-react";
import axios from "axios";

class App extends Component {
  state = {
    activities: [],
  };

  componentDidMount() {
    axios.get("https://localhost:5001/api/activities").then((response) => {

      this.setState({
        activities: response.data,
      });
    });
  }

  render() {
    return (
      <div >
        <Header as="h2">
          <Icon name="users" />
          <Header.Content>Reactivities</Header.Content>
        </Header>
        <List>
          {this.state.activities.map((activity: any) => (
             <List.Item key={activity.id}>{activity.title}</List.Item>
          ))}
        </List>
      </div>
    );
  }
}

export default App;
