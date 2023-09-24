import { Button, Segment } from "semantic-ui-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {v4 as uuid} from 'uuid';
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from 'yup';
import GenericTextInput from "../../../app/common/form/GenericTextInput";


export default observer(function ActivityForm(){
    
    const {activityStore} = useStore();
    const {selectedActivity, createActivity, updateActivity, loading, loadActivity, loadingInitial} = activityStore;
    const {id} = useParams();
    const navigate = useNavigate();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        category: '',
        date: '',
        description: '',
        city: '',
        venue: ''
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required(),
        venue: Yup.string().required(),
        city: Yup.string().required(),
    });

    useEffect(() =>{
        if(id) loadActivity(id).then(activity => setActivity(activity!))
    },[id, loadActivity]);
    
    // function handleSubmit(){
    //     if(!activity.id){
    //         activity.id = uuid();
    //         createActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    //     }else{
    //         updateActivity(activity).then(() => navigate(`/activities/${activity.id}`));
    //     }
    // }

    // function handleInputChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>){
    //     const {name , value} = event.target;
    //     setActivity({...activity, [name]:value})
    // }

    if(loadingInitial) return <LoadingComponent content="Loading Activity ..."/>
    return (
        <Segment clearing>
            <Formik 
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                onSubmit={values => console.log(values)}>
                {({handleSubmit}) =>(
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <GenericTextInput name="title" placeholder="Title"/>    
                        <GenericTextInput placeholder="Description" name='description'/>
                        <GenericTextInput placeholder="Category" name='category'/>
                        <GenericTextInput placeholder="Date" name='date'/>
                        <GenericTextInput placeholder="City" name='city'/>
                        <GenericTextInput placeholder="Venue" name='venue'/>
                        <Button loading={loading} floated="right" positive type="submit" content='Submit'/>
                        <Button as={Link} to='/activities' floated="right" type="button" content='Cancel'/>
                    </Form>
                )}
            </Formik>        
        </Segment>
    )
})