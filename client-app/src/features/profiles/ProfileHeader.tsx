import React, {FC} from 'react';
import {Button, Divider, Grid, Header, Item, Reveal, Segment, Statistic} from 'semantic-ui-react';
import {IProfile} from "../../app/models/Profile";
import {observer} from "mobx-react-lite";


interface IProps {
    profile: IProfile;
    follow: (username: string) => void;
    unfollow: (username: string) => void;
    isCurrentUser: boolean;
    loading: boolean;
}

const ProfileHeader: FC<IProps> = ({profile, follow, unfollow, isCurrentUser, loading}) => {

    return (
        <Segment>
            <Grid>
                <Grid.Column width={12}>
                    <Item.Group>
                        <Item>
                            <Item.Image
                                avatar
                                size='small'
                                src={profile?.image || '/assets/user.png'}
                            />
                            <Item.Content verticalAlign='middle'>
                                <Header as='h1'>{profile?.displayName}</Header>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Grid.Column>
                <Grid.Column width={4}>
                    <Statistic.Group widths={2}>
                        <Statistic label='Followers' value={profile?.followersCount}/>
                        <Statistic label='Following' value={profile?.followingCount}/>
                    </Statistic.Group>
                    <Divider/>
                    {!isCurrentUser &&
                    <Reveal animated='move'>
                        <Reveal.Content visible style={{width: '100%'}}>
                            <Button
                                fluid
                                color='teal'
                                content={profile?.following ? 'Following' : 'Not following'}
                            />
                        </Reveal.Content>
                        <Reveal.Content hidden>
                            <Button
                                loading={loading}
                                fluid
                                basic
                                color={profile?.following ? 'red' : 'green'}
                                content={profile?.following ? 'Unfollow' : 'Follow'}
                                onClick={profile?.following ? () => unfollow(profile.userName) : () => follow(profile.userName)}
                            />
                        </Reveal.Content>
                    </Reveal>
                    }
                </Grid.Column>
            </Grid>
        </Segment>
    );
};

export default observer(ProfileHeader);