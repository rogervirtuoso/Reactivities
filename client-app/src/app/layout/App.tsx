import React, {Fragment, useContext, useEffect} from 'react';
import {Container} from "semantic-ui-react";
import Navbar from "../../features/nav/navbar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite'

const App = () => {
    const activityStore = useContext(ActivityStore)

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    if (activityStore.loadingInitial) {
        return <LoadingComponent content="Loading activities..."/>
    }

    return (
        <Fragment>
            <Navbar/>
            <Container style={{marginTop: '7em'}}>
                <ActivityDashboard/>
            </Container>
        </Fragment>
    );
}

export default observer(App);
