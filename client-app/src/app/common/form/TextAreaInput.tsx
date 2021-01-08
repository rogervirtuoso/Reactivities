import React from 'react';
import {FieldRenderProps} from "react-final-form";
import {FormField, FormFieldProps, Label} from "semantic-ui-react";

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {

}

const TextAreaInput: React.FC<IProps> = ({
                                        input,
                                        rows,
                                        placeholder,
                                        meta: {touched, error}
                                    }) => {
    return <FormField error={touched && !!error}>
        <textarea {...input}
                  rows={rows}
                  placeholder={placeholder}
        />
        {touched && error && (
            <Label basic color={"red"}>
                {error}
            </Label>
        )}
    </FormField>
};

export default TextAreaInput;
