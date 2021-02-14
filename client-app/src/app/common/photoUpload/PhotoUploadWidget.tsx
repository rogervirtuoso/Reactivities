import React, {Fragment} from 'react';
import {Grid, Header} from 'semantic-ui-react';
import {observer} from 'mobx-react-lite';

export const PhotoUploadWidget = () => (
    <Fragment>
        <Grid>
            <Grid.Row/>
            <Grid.Column width={4}>
                <Header color='teal' sub content='Step 1 - Add Photo'/>
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 2 - Resize image'/>
            </Grid.Column>
            <Grid.Column width={1}/>
            <Grid.Column width={4}>
                <Header sub color='teal' content='Step 3 - Preview & Upload'/>
            </Grid.Column>
        </Grid>
    </Fragment>
);

export default observer(PhotoUploadWidget);