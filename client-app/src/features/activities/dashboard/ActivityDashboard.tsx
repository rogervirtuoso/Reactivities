import React, {useContext} from 'react';
import {Grid, List} from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import {observer} from "mobx-react-lite";
import activityStore from "../../../app/stores/activityStore";

const ActivityDashboard: React.FC = () => {
    const store = useContext(activityStore);
    const {selectedActivity, editMode} = store;
    return (
        <Grid>
            <Grid.Column width={10}>
                <List>
                    <ActivityList/>
                </List>
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode && <ActivityDetails/>}
                {editMode &&
                <ActivityForm key={selectedActivity && selectedActivity.id || 0} activity={selectedActivity!}/>}
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDashboard)