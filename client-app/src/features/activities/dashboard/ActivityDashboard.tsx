import React from 'react';
import {Grid, List} from "semantic-ui-react";
import ActivityList from "./ActivityList";
import {observer} from "mobx-react-lite";

const ActivityDashboard: React.FC = () => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <List>
                    <ActivityList/>
                </List>
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDashboard)