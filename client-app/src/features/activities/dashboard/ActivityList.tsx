import React, {FC, Fragment, useContext} from 'react';
import {Item, Label} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import ActivityListItem from "./ActivityListItem";
import {RootStoreContext} from "../../../app/stores/rootStore";
import {format} from "date-fns";

const ActivityList: FC = () => {
    const rootStore = useContext(RootStoreContext)
    const {activitiesByDates} = rootStore.activityStore;

    return (
        <Fragment>
            {activitiesByDates.map(([group, activities]) => (
                <Fragment key={group}>
                    <Label size='large' color='blue'>
                        {format(group, 'eeee do MMMM')}
                    </Label>
                    <Item.Group divided>
                        {activities.map(activity => (
                            <ActivityListItem key={activity.id} activity={activity}/>
                        ))
                        }
                    </Item.Group>
                </Fragment>
            ))}
        </Fragment>

    )
}

export default observer(ActivityList);