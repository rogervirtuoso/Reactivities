import React, {Fragment, useEffect, useState} from 'react';
import {Container} from "semantic-ui-react";
import {IActivity} from "../model/activity";
import axios from "axios";
import Navbar from "../../features/nav/navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";


const App = () => {
    const [activities, setActivities] = useState<IActivity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
    const [editMode, setEditMode] = useState(false);

    const handleSelectActivity = (id: string) => {
        setSelectedActivity(activities.filter(a => a.id === id)[0])
    }

    const handleOpenCreateForm = () => {
        setSelectedActivity(null);
        setEditMode(true);
    }

    const handleCreateActivity = (activity: IActivity) => {
        setActivities([...activities, activity]);
        setSelectedActivity(activity);
        setEditMode(false);
    }

    const handleEditActivity = (activity: IActivity) => {
        setActivities([...activities.filter(a => a.id !== activity.id), activity])
        setSelectedActivity(activity);
        setEditMode(false);
    }

    useEffect(() => {
        axios.get<IActivity[]>('http://localhost:5000/api/activities')
            .then(response => {
                setActivities(response.data)
            });
    }, []);

    return (
        <Fragment>
            <Navbar openCreateForm={handleOpenCreateForm}/>
            <Container style={{marginTop: '7em'}}>
                <ActivityDashboard activities={activities}
                                   selectActivity={handleSelectActivity}
                                   selectedActivity={selectedActivity}
                                   setSelectedActivity={setSelectedActivity}
                                   editMode={editMode}
                                   setEditMode={setEditMode}
                                   createActivity={handleCreateActivity}
                                   editActivity={handleEditActivity}
                />
            </Container>

        </Fragment>
    );
}

export default App;
