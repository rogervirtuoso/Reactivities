import React, {FC, useContext, useEffect, useState} from 'react';
import {Button, Form, FormGroup, Grid, GridColumn, Segment} from "semantic-ui-react";
import {ActivityFormValues} from "../../../app/model/activity";
import ActivityStore from "../../../app/stores/activityStore";
import {observer} from "mobx-react-lite";
import {RouteComponentProps} from "react-router";
import {Field, Form as FinalForm} from 'react-final-form';
import TextInput from "../../../app/common/form/TextInput";
import TextAreaInput from "../../../app/common/form/TextAreaInput";
import SelectInput from "../../../app/common/form/SelectInput";
import {category} from "../../../app/common/options/categoryOptions";

import DateInput from "../../../app/common/form/DateInput";
import {combineDateAndTime} from "../../../app/common/util/util";
import {combineValidators, composeValidators, hasLengthGreaterThan, isRequired} from 'revalidate'

const validate = combineValidators({
    title: isRequired({message: 'The event'}),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date'),
    time: isRequired('Time')
})

interface DetailParams {
    id: string;
}

const ActivityForm: FC<RouteComponentProps<DetailParams>> = ({match, history}) => {

    const activityStore = useContext(ActivityStore);
    const {submitting, loadActivity, createActivity, editActivity} = activityStore;

    const [activity, setActivity] = useState(new ActivityFormValues());
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id)
                .then((activity) => setActivity(new ActivityFormValues(activity)))
                .finally(() => setLoading(false));
        }
    }, [loadActivity, match.params.id]);

    const handleFinalFormSubmit = (values: any) => {
        const dateAndTime = combineDateAndTime(values.date, values.time);
        const {date, time, ...activity} = values;
        activity.date = dateAndTime;

        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: activity.id
            }
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    }

    return (
        <Grid>
            <GridColumn width={10}>
                <Segment clearing>
                    <FinalForm initialValues={activity}
                               validate={validate}
                               onSubmit={handleFinalFormSubmit}
                               render={({handleSubmit, invalid, pristine}) => (
                                   <Form onSubmit={handleSubmit} loading={loading}>
                                       <Field name={'title'}
                                              value={activity.title}
                                              placeholder='Title'
                                              component={TextInput}
                                       />
                                       <Field value={activity.description}
                                              name={'description'}
                                              rows={3}
                                              placeholder='Description'
                                              component={TextAreaInput}
                                       />
                                       <Field name={'category'}
                                              value={activity.category}
                                              placeholder='Category'
                                              component={SelectInput}
                                              options={category}
                                       />
                                       <FormGroup widths={"equal"}>
                                           <Field name='date'
                                                  placeholder='Date'
                                                  value={activity.date}
                                                  component={DateInput}
                                                  date={true}
                                           />
                                           <Field name='time'
                                                  time={true}
                                                  placeholder='Time'
                                                  value={activity.date}
                                                  component={DateInput}
                                           />
                                       </FormGroup>

                                       <Field name={'city'} value={activity.city}
                                              placeholder='City'
                                              component={TextInput}
                                       />
                                       <Field name={'venue'} value={activity.venue}
                                              placeholder='Venue'
                                              component={TextInput}
                                       />
                                       <Button loading={submitting}
                                               disabled={loading || invalid || pristine}
                                               floated={"right"} positive type="submit"
                                               content='Submit'
                                       />
                                       <Button
                                           onClick={activity.id
                                               ? () => history.push(`/activities/${activity.id}`)
                                               : () => history.push('/activities')}
                                           floated={"right"}
                                           disabled={loading}
                                           type="button"
                                           content='Cancel'/>
                                   </Form>
                               )}
                    />
                </Segment>
            </GridColumn>
        </Grid>

    );
}

export default observer(ActivityForm);