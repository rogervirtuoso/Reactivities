import React from 'react';
import {FieldRenderProps} from "react-final-form";
import {FormField, FormFieldProps, Label} from "semantic-ui-react";
import {DateTimePicker} from "react-widgets";

interface IProps extends FieldRenderProps<Date, HTMLElement>, FormFieldProps {

}

const DateInput: React.FC<IProps> = ({
                                         input,
                                         placeholder,
                                         date = false,
                                         time = false,
                                         meta: {touched, error}, id,
                                         ...rest
                                     }) => {
    return (<FormField error={touched && !!error}>
        <DateTimePicker
            placeholder={placeholder}
            value={input.value || null}
            onChange={input.onChange}
            onBlur={input.onBlur}
            onKeyDown={(e) => e.preventDefault()}
            date={date}
            time={time}
            {...rest}
        />
        {touched && error && (
            <Label basic color={"red"}>
                {error}
            </Label>
        )}
    </FormField>)
};

export default DateInput;
