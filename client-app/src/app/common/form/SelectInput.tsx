import React from 'react';
import {FieldRenderProps} from "react-final-form";
import {FormField, FormFieldProps, Label, Select} from "semantic-ui-react";

interface IProps extends FieldRenderProps<string, HTMLElement>, FormFieldProps {

}

const SelectInput: React.FC<IProps> = ({
                                           input,
                                           options,
                                           placeholder,
                                           meta: {touched, error}
                                       }) => {
    return <FormField error={touched && !!error}>
        <Select value={input.value}
                onChange={(e, data) => input.onChange(data.value)}
                placeholder={placeholder}
                options={options}

        />
        {touched && error && (
            <Label basic color={"red"}>
                {error}
            </Label>
        )}
    </FormField>
};

export default SelectInput;
