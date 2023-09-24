import { useField } from "formik";
import { Form, Label, Select } from "semantic-ui-react";

interface Props{
    placeholder: string;
    name: string;
    option:{text: string, value: string}[];
    label?: string;
}

export default function GenericSelectInput(props: Props){
   const [field, meta, helpers] = useField(props.name)
   return(
    <Form.Field error={meta.touched && !!meta.error}>
        <label>{props.label}</label>
        <Select
            clearable
            options={props.option}
            value={field.value || null}
            onChange={(_, d) => helpers.setValue(d.value)}
            onBlur={() => helpers.setTouched(true)}
            placeholder={props.placeholder}
        />
        {meta.touched && meta.error ? (
            <Label basic color="red">{meta.error}</Label>
        ) : null}
    </Form.Field>
   )
}