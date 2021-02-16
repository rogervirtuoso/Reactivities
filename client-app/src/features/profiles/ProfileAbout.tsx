import {observer} from 'mobx-react-lite';
import React, {useContext, useState} from 'react';
import {Button, Card, Form, Grid, Header, Tab} from "semantic-ui-react";
import {RootStoreContext} from "../../app/stores/rootStore";
import {Field, Form as FinalForm} from "react-final-form";
import {IProfileFormValues} from "../../app/models/Profile";
import TextInput from "../../app/common/form/TextInput";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import {FORM_ERROR} from "final-form";
import TextAreaInput from "../../app/common/form/TextAreaInput";
import {combineValidators, isRequired} from "revalidate";

const validate = combineValidators({
    displayname: isRequired({message: 'Display name'}),
})

const ProfileAbout = () => {
    const rootStore = useContext(RootStoreContext);
    const {profile, isCurrentUser, updateProfile, loadingProfile} = rootStore.profileStore;
    const [updateMode, setUpdateMode] = useState(false);


    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: 0}}>
                    <Header floated={"left"} icon={'user'}/>
                    {isCurrentUser &&
                    <Button floated={"right"}
                            basic
                            content={updateMode ? 'Cancel' : 'Edit'}
                            onClick={() => setUpdateMode(!updateMode)} fo
                    />
                    }
                    {!updateMode &&
                    <Card fluid>
                        <Card.Content header={'About ' + profile?.displayName}/>
                        <Card.Content description={profile?.bio}/>
                    </Card>
                    }

                </Grid.Column>
                <Grid.Column width={16}>
                    {updateMode &&
                    <FinalForm
                        initialValues={profile!}
                        validate={validate}
                        onSubmit={(values:IProfileFormValues)=> updateProfile(values).then(() => {setUpdateMode(false)}).catch(error => ({
                            [FORM_ERROR]: error
                        }))}
                               render={({handleSubmit, submitting, form, submitError, invalid, pristine, dirtySinceLastSubmit}) => (
                                   <Form onSubmit={handleSubmit} error>
                                       <Field
                                           name='displayname'
                                           component={TextInput}
                                           placeholder='Display Name'
                                           value={profile!.displayName}
                                           initialValue={profile!.displayName}
                                       />
                                       <Field
                                           name='bio'
                                           component={TextAreaInput}
                                           placeholder='Bio'
                                           value={profile!.bio}

                                       />
                                       {submitError && !dirtySinceLastSubmit &&
                                       <ErrorMessage
                                           error={submitError}
                                       />
                                       }
                                       <Button disabled={(invalid && !dirtySinceLastSubmit) || pristine}
                                               loading={submitting || loadingProfile}
                                               positive
                                               content='Update'
                                               floated={'right'}
                                               type="submit"
                                       />
                                       {/*<pre>{JSON.stringify(form.getState(), null, 2)}</pre>*/}
                                   </Form>
                               )}


                    />
                    }
                </Grid.Column>
            </Grid>

        </Tab.Pane>
    );
};

export default observer(ProfileAbout);
