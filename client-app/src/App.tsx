import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';

function App(): JSX.Element {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/activities/')
      .then(response => {
        setActivities(response.data)
      })
    // return () => {
    //   cleanup
    // }
  }, [])

  return (
    <div>
      <Header as="h2" icon="users" content="CodeDancingActivities" />
      <List>
        {activities?.map((activity: any) => (
          <List.Item key={activity.id}>{activity.title}</List.Item>
        ))}
      </List>
    </div>
  );
}

export default App;
