import React from 'react';
import {Grid, Icon, Segment} from "semantic-ui-react";
import {IActivity} from "../../../app/model/activity";
import {observer} from "mobx-react-lite";

interface IProps {
    activity: IActivity;
}

const ActivityDetailedInfo: React.FC<IProps> = ({activity}) => {
    return (
        <div>
            <Segment.Group>
                <Segment attached='top'>
                    <Grid>
                        <Grid.Column width={1}>
                            <Icon size='large' color='teal' name='info'/>
                        </Grid.Column>
                        <Grid.Column width={15}>
                            <p>{activity.description}</p>
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Segment attached>
                    <Grid verticalAlign='middle'>
                        <Grid.Column width={1}>
                            <Icon name='calendar' size='large' color='teal'/>
                        </Grid.Column>
                        <Grid.Column width={15}>
            <span>
              {activity.date}
            </span>
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Segment attached>
                    <Grid verticalAlign='middle'>
                        <Grid.Column width={1}>
                            <Icon name='marker' size='large' color='teal'/>
                        </Grid.Column>
                        <Grid.Column width={11}>
                            <span>{activity.venue}, {activity.city}</span>
                        </Grid.Column>
                    </Grid>
                </Segment>
            </Segment.Group>
        </div>
    );
};

export default observer(ActivityDetailedInfo);
