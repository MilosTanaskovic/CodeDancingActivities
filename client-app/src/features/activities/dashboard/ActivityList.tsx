import { observer } from 'mobx-react-lite';
import React, {SyntheticEvent, useState} from 'react'
import { Button, Item, Label, List, Segment } from 'semantic-ui-react'
import { useStore } from '../../../app/stores/store';

export default observer(function ActivityList() {
    const { activityStore } = useStore();
    const { activitiesByDate, selectActivity, deleteActivity, loading } = activityStore;
    const [target, setTarget] = useState('');

    const handleActivityDelete = (e: SyntheticEvent<HTMLButtonElement>, id: string) => {
        setTarget(e.currentTarget.name);
        deleteActivity(id);
    }

    return (
        <Segment>
           <Item.Group divided>
                {activitiesByDate?.map((activity) => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button 
                                    floated='right' 
                                    content='View' 
                                    color='blue' 
                                    onClick={() => selectActivity(activity.id)}
                                />
                                <Button
                                    name={activity.id}
                                    loading={loading && target === activity.id} 
                                    floated='right' 
                                    content='Delete' 
                                    color='red' 
                                    onClick={(e) => handleActivityDelete(e, activity.id)}
                                />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
           </Item.Group>
        </Segment>
    )
});
