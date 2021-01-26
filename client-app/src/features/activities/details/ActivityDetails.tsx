import React, {FC, useContext, useEffect} from 'react';
import {Grid, GridColumn} from "semantic-ui-react";
import {observer} from "mobx-react-lite";
import {RouteComponentProps} from "react-router";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";
import {RootStoreContext} from "../../../app/stores/rootStore";

interface DetailParams {
    id: string;
}

const ActivityDetails: FC<RouteComponentProps<DetailParams>> = ({match}) => {
        const rootStore = useContext(RootStoreContext)
        const {activity, loadActivity, loadingInitial} = rootStore.activityStore;

        useEffect(() => {
            loadActivity(match.params.id);
        }, [loadActivity, match.params.id])

        if (loadingInitial) return <LoadingComponent content='Loading activity...'/>

        if (!activity)
            return <h2>Activity not found</h2>

        return (
            <Grid>
                <GridColumn width={10}>
                    <ActivityDetailedHeader activity={activity}/>
                    <ActivityDetailedInfo activity={activity}/>
                    <ActivityDetailedChat/>
                </GridColumn>
                <GridColumn width={6}>
                    <ActivityDetailedSidebar/>
                </GridColumn>
            </Grid>
        )
    }
;

export default observer(ActivityDetails)