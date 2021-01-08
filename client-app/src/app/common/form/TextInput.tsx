import React from 'react';
import {FieldRenderProps} from "react-final-form";
import {FormField, FormFieldProps, Label} from "semantic-ui-react";

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {

}

const TextInput: React.FC<IProps> = ({
                                         input,
                                         width,
                                         type,
                                         placeholder,
                                         meta: {touched, error}
                                     }) => {
    return <FormField error={touched && !!error}>
        <input {...input}
               placeholder={placeholder}
               type={type}
               width={width}
        />
        {touched && error && (
            <Label basic color={"red"}>
                {error}
            </Label>
        )}
    </FormField>
};

export default TextInput;
