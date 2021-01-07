import React, {Fragment} from 'react';
import {Container} from "semantic-ui-react";
import Navbar from "../../features/nav/navbar";
import {observer} from 'mobx-react-lite'
import {Route, RouteComponentProps, Switch, withRouter} from 'react-router-dom'
import HomePage from "../../features/home/HomePage";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import {ToastContainer} from "react-toastify";

const App: React.FC<RouteComponentProps> = ({location}) => {

    return (
        <Fragment>
            <Route exact path='/' component={HomePage}/>
            <Route path={'/(.+)'} render={() =>
                <Fragment>
                    <ToastContainer position={"bottom-right"}>

                    </ToastContainer>
                    <Navbar/>
                    <Container style={{marginTop: '7em'}}>
                        <Switch>
                            <Route exact path='/activities' component={ActivityDashboard}/>
                            <Route path='/activities/:id' component={ActivityDetails}/>
                            <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm}/>
                            <Route component={NotFound}/>
                        </Switch>
                    </Container>
                </Fragment>}/>
        </Fragment>
    );
}

export default withRouter(observer(App));
