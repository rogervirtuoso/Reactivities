import React, {useContext, useState} from 'react';
import {Button, ButtonGroup, Card, Grid, Header, Image, Tab} from "semantic-ui-react";
import {RootStoreContext} from "../../app/stores/rootStore";
import {PhotoUploadWidget} from "../../app/common/photoUpload/PhotoUploadWidget";
import {observer} from "mobx-react-lite";

const ProfilePhotos = () => {
    const rootStore = useContext(RootStoreContext);
    const {profile, isCurrentUser, uploadPhoto, uploadingPhoto, setMainPhoto, loading} = rootStore.profileStore;
    const [addPhotoMode, setAddPhotoMode] = useState(false);

    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: 0}}>
                    <Header floated={"left"} icon={'image'} content={'Photos'}/>
                    {isCurrentUser &&
                    <Button floated={"right"}
                            basic
                            content={addPhotoMode ? 'Cancel' : 'Add Photo'}
                            onClick={() => setAddPhotoMode(!addPhotoMode)}
                    />
                    }
                </Grid.Column>
                <Grid.Column width={16}>
                    {addPhotoMode ? (
                        <PhotoUploadWidget uploadPhoto={uploadPhoto} loading={uploadingPhoto} setAddPhotoMode={setAddPhotoMode}/>
                    ) : <Card.Group itemsPerRow={5}>
                        {profile && profile.photos.map(photo => (
                            <Card key={photo.id}>
                                <Image src={photo.url}/>
                                {isCurrentUser &&
                                <ButtonGroup fluid widths={2}>
                                    <Button
                                        id={photo.id}
                                        onClick={() => {setMainPhoto(photo)}}
                                        basic
                                        positive
                                        content={'Main'}
                                        loading={loading}
                                    />
                                    <Button basic negative icon={'trash'}/>
                                </ButtonGroup>
                                }
                            </Card>
                        ))}
                    </Card.Group>
                    }

                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
};

export default observer(ProfilePhotos);
