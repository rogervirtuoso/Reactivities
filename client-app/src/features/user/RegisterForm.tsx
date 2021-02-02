import React, {useContext} from 'react';
import {Field, Form as FinalForm} from 'react-final-form';
import {Button, Form, Header} from "semantic-ui-react";
import TextInput from "../../app/common/form/TextInput";
import {RootStoreContext} from "../../app/stores/rootStore";
import {IUserFormValues} from "../../app/models/User";
import {FORM_ERROR} from "final-form";
import {combineValidators, isRequired} from "revalidate";
import ErrorMessage from "../../app/common/form/ErrorMessage";

const validator = combineValidators({
    username: isRequired('username'),
    displayname: isRequired('displayname'),
    email: isRequired('email'),
    password: isRequired('password')
});


const RegisterForm = () => {
    const rootStore = useContext(RootStoreContext);
    const {register} = rootStore.userStore;

    return (
        <FinalForm
            onSubmit={(values: IUserFormValues) => register(values).catch(error => ({
                [FORM_ERROR]: error
            }))}
            validate={validator}
            render={({handleSubmit, submitting, form, submitError, invalid, pristine, dirtySinceLastSubmit}) => (
                <Form onSubmit={handleSubmit} error>
                    <Header
                        as='h2'
                        content='Login to Reactivities'
                        color='teal'
                        textAlign='center'
                    />
                    <Field name='username' component={TextInput} placeholder='Username'/>
                    <Field name='displayname' component={TextInput} placeholder='Display Name'/>
                    <Field name='email' component={TextInput} placeholder='Email'/>
                    <Field name='password' type={'password'} component={TextInput} placeholder='Password'/>
                    {submitError && !dirtySinceLastSubmit &&
                        <ErrorMessage
                            error={submitError}
                        />
                    }
                    <Button disabled={(invalid && !dirtySinceLastSubmit) || pristine} loading={submitting} color='teal'
                            content='Login' fluid/>
                    {/*<pre>{JSON.stringify(form.getState(), null, 2)}</pre>*/}
                </Form>
            )}
        />
    );
};

export default RegisterForm;
