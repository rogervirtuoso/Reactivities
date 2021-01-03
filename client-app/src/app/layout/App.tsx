import React, {Fragment, useContext, useEffect} from 'react';
import {Container} from "semantic-ui-react";
import Navbar from "../../features/nav/navbar";
import LoadingComponent from "./LoadingComponent";
import ActivityStore from '../stores/activityStore';
import {observer} from 'mobx-react-lite'
import {Route, RouteComponentProps, withRouter} from 'react-router-dom'
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

const App: React.FC<RouteComponentProps> = ({location}) => {
    const activityStore = useContext(ActivityStore)

    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    if (activityStore.loadingInitial) {
        return <LoadingComponent content="Loading activities..."/>
    }

    return (
        <Fragment>
            <Route exact path='/' component={HomePage}/>
            <Route path={'/(.+)'} render={() =>
                <Fragment>
                    <Navbar/>
                    <Container style={{marginTop: '7em'}}>
                        <Route exact path='/activities' component={ActivityDashboard}/>
                        <Route path='/activities/:id' component={ActivityDetails}/>
                        <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
                    </Container>
                </Fragment>}/>
        </Fragment>
    );
}

export default withRouter(observer(App));
