import { Formik } from "formik";
import GenericTextInput from "../common/form/GenericTextInput";
import { Button, Form } from "semantic-ui-react";

export default function LoginForm()
{
    return (
        <Formik
            initialValues={{email:'', password:''}}
            onSubmit={values => console.log(values)}
        >
            {({handleSubmit}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <GenericTextInput placeholder="Email" name='email'/>
                    <GenericTextInput placeholder="Password" name='password' type="password"/>
                    <Button positive content='Login' type="submit" fluid/>
                </Form>
            )}
            
        </Formik>
    )
}