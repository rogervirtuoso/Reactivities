import React, {FC, FormEvent, useContext, useState} from 'react';
import {Button, Form, Segment} from "semantic-ui-react";
import {IActivity} from "../../../app/model/activity";
import ActivityStore from "../../../app/stores/activityStore";
import {observer} from "mobx-react-lite";

interface IProps {
    activity: IActivity;
}


const ActivityForm: FC<IProps> = ({
                                      activity: initializeFormState
                                  }) => {

    const activityStore = useContext(ActivityStore);
    const {createActivity, editActivity, submitting, cancelFormOpen} = activityStore;
    const initializeForm = () => {
        if (initializeFormState) {
            return initializeFormState;
        } else {
            return {
                id: '',
                title: '',
                category: '',
                description: '',
                date: '',
                city: '',
                venue: ''
            };
        }
    }

    const [activity, setActivity] = useState<IActivity>(initializeForm);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault()
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: activity.id
            }
            createActivity(newActivity);
        } else {
            editActivity(activity)
        }
    }


    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.currentTarget;
        setActivity({...activity, [name]: value});
        event.preventDefault();
    }


    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input onChange={handleInputChange} name={'title'} value={activity.title} placeholder='Title'/>
                <Form.TextArea onChange={handleInputChange} value={activity.description} name={'description'} rows={2}
                               placeholder='Description'/>
                <Form.Input onChange={handleInputChange} name={'category'} value={activity.category}
                            placeholder='Category'/>
                <Form.Input onChange={handleInputChange} name={'date'} value={activity.date} type='datetime-local'
                            placeholder='Date'/>
                <Form.Input onChange={handleInputChange} name={'city'} value={activity.city} placeholder='City'/>
                <Form.Input onChange={handleInputChange} name={'venue'} value={activity.venue} placeholder='Venue'/>
                <Button loading={submitting} floated={"right"} positive type="submit" content='Submit'/>
                <Button onClick={() => cancelFormOpen()} floated={"right"} type="button" content='Cancel'/>
            </Form>

        </Segment>
    );
}

export default observer(ActivityForm);