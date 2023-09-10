import { Fragment, useEffect, useState } from 'react'
import axios from 'axios';
import { Container, Header, List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './NavBar';

function App() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() =>{
    axios.get<Activity[]>('http://localhost:5010/api/activities')
      .then(res => {
        setActivities(res.data);
      })
  }, []);

  return (
    <>
      <NavBar/>
      <Container style={{marginTop: '7em'}}>
        <List>
          {activities.map((activity) => (
            <List.Item key={activity.id}>
              {activity.title}
            </List.Item>
          ))}
        </List>
      </Container>
    </>
  )
}

export default App
