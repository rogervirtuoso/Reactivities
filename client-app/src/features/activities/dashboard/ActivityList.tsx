import React, {FC, useContext} from 'react';
import {Item, Segment} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import ActivityStore from '../../../app/stores/activityStore'
import ActivityListItem from "./ActivityListItem";

const ActivityList: FC = () => {
    const activityStore = useContext(ActivityStore);
    const {activitiesByDates, submitting, deleteActivity, target} = activityStore

    return (
        <Segment clearing>
            <Item.Group divided>
                {activitiesByDates.map(activity => (
                    <ActivityListItem activity={activity}/>
                ))
                }
            </Item.Group>
        </Segment>
    )
}

export default observer(ActivityList);