import React, {FC, useContext} from 'react';
import {Button, Item, Label, Segment} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import ActivityStore from '../../../app/stores/activityStore'

const ActivityList: FC = () => {
    const activityStore = useContext(ActivityStore);
    const {activitiesByDates, selectActivity, submitting, deleteActivity, target} = activityStore

    return (
        <Segment clearing>
            <Item.Group divided>
                {activitiesByDates.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Meta>{activity.date}</Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city}, {activity.venue}</div>
                                {/*<Image src='/images/wireframe/short-paragraph.png'/>*/}
                            </Item.Description>
                            <Item.Extra>
                                <Button onClick={() => selectActivity(activity.id)} floated={"right"} type="button"
                                        content="View" color="blue"/>
                                <Button name={activity.id} loading={target === activity.id && submitting}
                                        onClick={(e) => deleteActivity(e, activity.id)} floated={"right"} type="button"
                                        content="Delete" color="red"/>

                                <Label basic content={activity.category}/>
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))
                }
            </Item.Group>
        </Segment>
    )
}

export default observer(ActivityList);