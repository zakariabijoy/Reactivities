import { Button, Header, Segment } from "semantic-ui-react";
import { useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity, ActivityFormValues } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {v4 as uuid} from 'uuid';
import { Formik, Form } from "formik";
import * as Yup from 'yup';
import GenericTextInput from "../../../app/common/form/GenericTextInput";
import GenericTextArea from "../../../app/common/form/GenericTextArea";
import GenericSelectInput from "../../../app/common/form/GenericSelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOption";
import GenericDateInput from "../../../app/common/form/GenericDateInput";


export default observer(function ActivityForm(){
    
    const {activityStore} = useStore();
    const {createActivity, updateActivity, loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('date is required'),
        venue: Yup.string().required(),
        city: Yup.string().required(),
    });

    useEffect(() =>{
        if(id) loadActivity(id).then(activity => setActivity(new ActivityFormValues(activity)))
    },[id, loadActivity]);
    
    function handleFormSubmit(activity: ActivityFormValues){
        if(!activity.id){
            activity.id = uuid();
            createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }else{
            updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
        }
    }

    if(loadingInitial) return <LoadingComponent content="Loading Activity ..."/>
    return (
        <Segment clearing>
            <Header content='Activity Details' sub color="teal" />
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values => handleFormSubmit(values)}>
                {({handleSubmit, isValid, isSubmitting, dirty}) =>(
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <GenericTextInput name="title" placeholder="Title"/>    
                        <GenericTextArea rows={3} placeholder="Description" name='description'/>
                        <GenericSelectInput option={categoryOptions} placeholder="Category" name='category'/>
                        <GenericDateInput 
                            placeholderText="Date" 
                            name='date'
                            showTimeSelect
                            timeCaption="time"
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                        <Header content='Location Details' sub color="teal" />
                        <GenericTextInput placeholder="City" name='city'/>
                        <GenericTextInput placeholder="Venue" name='venue'/>
                        <Button 
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={isSubmitting} 
                            floated="right" 
                            positive 
                            type="submit" 
                            content='Submit'
                        />
                        <Button as={Link} to='/activities' floated="right" type="button" content='Cancel'/>
                    </Form>
                )}
            </Formik>        
        </Segment>
    )
})