import React, {useContext} from 'react';
import {Button, Icon, Item, ItemGroup, Label, Segment} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {IActivity} from "../../../app/models/activity";
import {format} from 'date-fns';
import {RootStoreContext} from "../../../app/stores/rootStore";
import ActivityListItemAttendees from "./ActivityListItemAttendees";

const ActivityListItem: React.FC<{ activity: IActivity }> = ({activity}) => {
    const rootStore = useContext(RootStoreContext);
    const {submitting, deleteActivity, target} = rootStore.activityStore

    const host = activity.attendees.filter(x => x.isHost)[0];
    return (
        <Segment.Group>
            <Segment>
                <ItemGroup>
                    <Item>
                        <Item.Image size='tiny' circular src={host.image || '/assets/user.png'} style={{marginBottom: 3}} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                            <Item.Description>Hosted by <Link to={`profile/${host.username}`} >{host.displayName}</Link></Item.Description>
                            {activity.isHost &&
                             <Item.Description>
                                <Label basic
                                       color='orange'
                                       content='You are hosting this activity'
                                />
                            </Item.Description>}
                            {activity.isGoing && !activity.isHost &&
                            <Item.Description>
                                <Label
                                       color='green'
                                       content='You are going to this activity'
                                />
                            </Item.Description>}
                        </Item.Content>
                    </Item>
                </ItemGroup>
            </Segment>
            <Segment>
                <Icon name={"clock"}/> {format(activity.date, 'h:mm a')}
                <Icon name={"marker"}/> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAttendees attendees={activity.attendees}/>
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
