import React from 'react';
import {Grid, List} from "semantic-ui-react";
import {IActivity} from "../../../app/model/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

interface IProps {
    activities: IActivity[],
    selectActivity: (id: string) => void;
    selectedActivity: IActivity | null;
    editMode: boolean;
    setEditMode: (editMode: boolean) => void
    setSelectedActivity: (activaty: IActivity | null) => void;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;

}

const ActivityDashboard: React.FC<IProps> = ({
                                                 activities,
                                                 selectActivity,
                                                 selectedActivity,
                                                 editMode,
                                                 setEditMode, setSelectedActivity, createActivity, editActivity
                                             }) => {
    return (
        <Grid>
            <Grid.Column width={10}>
                <List>
                    <ActivityList activities={activities} selectActivity={selectActivity}/>
                </List>
            </Grid.Column>
            <Grid.Column width={6}>
                {selectedActivity && !editMode &&
                <ActivityDetails activity={selectedActivity} setEditMode={setEditMode} setSelectedActivity={setSelectedActivity}/>
                }
                {editMode &&
                    <ActivityForm setEditMode={setEditMode} activity={selectedActivity!}
                        createActivity={createActivity} editActivity={editActivity}
                    />}
            </Grid.Column>
        </Grid>
    );
};


export default ActivityDashboard