import React from "react";
import { FieldRenderProps } from "react-final-form";
import { Form, FormFieldProps, Label, Select } from "semantic-ui-react";

interface IProps extends FieldRenderProps<string, any>, FormFieldProps {}

export const SelectInput: React.FC<IProps> = ({
  input,
  width,
  options,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      <Select
        value={input.value}
        onChange={(e, data) => input.onChange(data.value)}
        placeholder={placeholder}
        options={options}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  );
};
