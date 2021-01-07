import React, {FC, FormEvent, useContext, useEffect, useState} from 'react';
import {Button, Form, Grid, GridColumn, Segment} from "semantic-ui-react";
import {IActivity} from "../../../app/model/activity";
import ActivityStore from "../../../app/stores/activityStore";
import {observer} from "mobx-react-lite";
import {RouteComponentProps} from "react-router";

interface DetailParams {
    id: string;
}

const ActivityForm: FC<RouteComponentProps<DetailParams>> = ({match, history}) => {

    const activityStore = useContext(ActivityStore);
    const {createActivity, editActivity, submitting, activity: initialFormState, loadActivity, clearActivity} = activityStore;

    const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
    });

    useEffect(() => {
        if (match.params.id && activity.id.length === 0) {
            loadActivity(match.params.id).then(() => {
                initialFormState && setActivity(initialFormState);
            });
        }
        return () => {
            clearActivity();
        }


    }, [loadActivity, clearActivity, match.params.id, initialFormState, activity.id.length]);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: activity.id
            }
            createActivity(newActivity).then(() => {
                history.push(`/activities/${newActivity.id}`);
            });
        } else {
            editActivity(activity).then(() => {
                history.push(`/activities/${activity.id}`);
            })
        }
    }


    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
        event.preventDefault();
    }


    return (
        <Grid>
            <GridColumn width={10}>
                <Segment clearing>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input onChange={handleInputChange} name={'title'} value={activity.title}
                                    placeholder='Title'/>
                        <Form.TextArea onChange={handleInputChange} value={activity.description} name={'description'}
                                       rows={2}
                                       placeholder='Description'/>
                        <Form.Input onChange={handleInputChange} name={'category'} value={activity.category}
                                    placeholder='Category'/>
                        <Form.Input onChange={handleInputChange} name={'date'} value={activity.date}
                                    type='datetime-local'
                                    placeholder='Date'/>
                        <Form.Input onChange={handleInputChange} name={'city'} value={activity.city}
                                    placeholder='City'/>
                        <Form.Input onChange={handleInputChange} name={'venue'} value={activity.venue}
                                    placeholder='Venue'/>
                        <Button loading={submitting} floated={"right"} positive type="submit" content='Submit'/>
                        <Button onClick={() => history.push('/activities')} floated={"right"} type="button"
                                content='Cancel'/>
                    </Form>

                </Segment>
            </GridColumn>
        </Grid>

    );
}

export default observer(ActivityForm);