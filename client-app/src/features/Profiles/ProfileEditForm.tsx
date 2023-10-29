import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup';
import GenericTextInput from "../../app/common/form/GenericTextInput";
import GenericTextArea from "../../app/common/form/GenericTextArea";
import { Form, Formik } from "formik";
import { Button } from "semantic-ui-react";

interface Props {
    setEditMode: (editMode: boolean) => void;
}

export default observer(function ProfileEditForm({ setEditMode }: Props) {
    const { profileStore: { profile, updateProfile } } = useStore();
    return (
        <Formik
            initialValues={{
                displayName: profile?.displayName, 
                bio: profile?.bio || ''
            }}
            onSubmit={(values:any) => {
                updateProfile(values).then(() => {
                    setEditMode(false);
                })
            }}
            validationSchema={Yup.object({
                displayName: Yup.string().required()
            })} >
            {({ isSubmitting, isValid, dirty }) => (
                <Form className='ui form'>
                    <GenericTextInput 
                        placeholder='Display Name'
                        name='displayName' 
                    />
                    <GenericTextArea rows={3} placeholder='Add your bio' name='bio' />
                    <Button
                        positive
                        type='submit'
                        loading={isSubmitting}
                        content='Update profile'
                        floated='right'
                        disabled={!isValid || !dirty}
                    /> 
                </Form>
            )} 
        </Formik>
    )
})