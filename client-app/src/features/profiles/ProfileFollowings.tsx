import React, {useContext} from 'react';
import {Card, Grid, Header, Tab} from 'semantic-ui-react';
import {RootStoreContext} from '../../app/stores/rootStore';
import ProfileCard from './ProfileCard';
import {observer} from "mobx-react-lite";

const ProfileFollowings = () => {
    const rootStore = useContext(RootStoreContext);
    const {profile,  loading, followings, activeTab} = rootStore.profileStore;

    return (
        <Tab.Pane loading={loading}>
            <Grid>
                <Grid.Column width={16}>
                    <Header
                        floated='left'
                        icon='user'
                        content={
                            activeTab === 3
                                ? `People following ${profile!.displayName}`
                                : `People ${profile!.displayName} is following`
                        }
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={5}>
                        {followings.map((profile) => (
                            <ProfileCard key={profile.userName} profile={profile}/>
                        ))}
                        {/*<Image src={'/assets/user.png'} />*/}
                        {/*<Card.Content>*/}
                        {/*    <Card.Header>{'asfasf'}</Card.Header>*/}
                        {/*</Card.Content>*/}
                        {/*<Card.Content extra>*/}
                        {/*</Card.Content>*/}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
};

export default observer(ProfileFollowings);