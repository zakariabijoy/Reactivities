import { Formik } from "formik";
import GenericTextInput from "../common/form/GenericTextInput";
import { Button, Form } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

export default observer (function LoginForm()
{
    const {userStore} = useStore();
    return (
        <Formik
            initialValues={{email:'', password:''}}
            onSubmit={values => userStore.login(values)}
        >
            {({handleSubmit, isSubmitting}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <GenericTextInput placeholder="Email" name='email'/>
                    <GenericTextInput placeholder="Password" name='password' type="password"/>
                    <Button loading={isSubmitting} positive content='Login' type="submit" fluid/>
                </Form>
            )}
            
        </Formik>
    )
})