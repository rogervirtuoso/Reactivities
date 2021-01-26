import React, {useContext} from 'react';
import {Button, Icon, Item, ItemGroup, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {IActivity} from "../../../app/models/activity";
import {format} from 'date-fns';
import {RootStoreContext} from "../../../app/stores/rootStore";

const ActivityListItem: React.FC<{ activity: IActivity }> = ({activity}) => {
    const rootStore = useContext(RootStoreContext);
    const {submitting, deleteActivity, target} = rootStore.activityStore
    return (
        <Segment.Group>
            <Segment>
                <ItemGroup>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png'/>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title}</Item.Header>
                            <Item.Description>
                                Hosted by Bob
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </ItemGroup>
            </Segment>
            <Segment>
                <Icon name={"clock"}/> {format(activity.date, 'h:mm a')}
                <Icon name={"marker"}/> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                Attendees will go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity?.id}`} floated={"right"} type="button"
                        content="View" color="blue"/>

                <Button name={activity.id} loading={target === activity.id && submitting}
                        onClick={(e) => deleteActivity(e, activity.id)} floated={"right"} type="button"
                        content="Delete" color="red"/>
            </Segment>
        </Segment.Group>

    );
};

export default ActivityListItem;
