import { ErrorMessage, Formik } from "formik";
import GenericTextInput from "../common/form/GenericTextInput";
import { Button, Form, Header, Label } from "semantic-ui-react";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

export default observer (function LoginForm()
{
    const {userStore} = useStore();
    return (
        <Formik
            initialValues={{email:'', password:'', error: null}}
            onSubmit={(values, {setErrors}) => userStore.login(values).catch(err => 
                setErrors({error: 'Invalid email or password' }) )}
        >
            {({handleSubmit, isSubmitting, errors}) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <Header as='h2' content='Login to Reactivities' color="teal" textAlign="center"/>
                    <GenericTextInput placeholder="Email" name='email'/>
                    <GenericTextInput placeholder="Password" name='password' type="password"/>
                    <ErrorMessage
                    name="error"
                    render={() =>
                     <Label style={{marginBottom: 10}} basic color="red" content={errors.error}/>}
                     />
                    <Button loading={isSubmitting} positive content='Login' type="submit" fluid/>
                </Form>
            )}
            
        </Formik>
    )
})