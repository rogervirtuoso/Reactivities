import React from 'react';
import {FieldRenderProps} from "react-final-form";
import {FormField, FormFieldProps, Label} from "semantic-ui-react";

interface IProps extends FieldRenderProps<string, HTMLInputElement | HTMLElement>, FormFieldProps {

}

const TextInput: React.FC<IProps> = ({
                                         input,
                                         width,
                                         placeholder,
                                         meta: {touched, error}
                                     }) => {
    return <FormField error={touched && !!error}>
        <input {...input}
               placeholder={placeholder}
               width={width}
        />
        <br/>
        {touched && error && (

            <Label basic color={"red"}>
                {error}
            </Label>
        )}
    </FormField>
};

export default TextInput;
