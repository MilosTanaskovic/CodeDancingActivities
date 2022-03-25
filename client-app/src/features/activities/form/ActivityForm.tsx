import { observer } from 'mobx-react-lite'
import {useEffect, useState} from 'react'
import { useHistory, useParams } from 'react-router';
import { Button, Header, Segment } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store'
import { v4 as uuid } from 'uuid';
import { Link } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import MyTextInput from '../../../app/common/form/MyTextInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MySelectInput from '../../../app/common/form/MySelectInput';
import { categoryOptions } from '../../../app/common/options/categoryOptions';
import MyDateInput from '../../../app/common/form/MyDateInput';
import { ActivityFormValues } from '../../../app/models/activity';

export default observer(function ActivityForm() {
    const history = useHistory();
    const {activityStore} = useStore();
    const {createActivity, updateActivity, loading, loadingActivity, loadingInitial} = activityStore;
    const { id } = useParams<{id: string}>();

    const [activity, setActivity] = useState<ActivityFormValues>(new ActivityFormValues);

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is requried'),
        description: Yup.string().required('The activity description is requried'),
        category: Yup.string().required(),
        date: Yup.string().required('Date is requried').nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required(),

    })

    useEffect(() => {
        if(id) loadingActivity(id).then(activity => setActivity(new ActivityFormValues(activity)));
    }, [id, loadingActivity]);

    

    // handle Submit
    const handleFormSubmit = (activity: ActivityFormValues) => {
        if(!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        }else {
            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`));
        }
    }

    // // handle input change
    // const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    //     console.log(event.target);
    //     const {name, value} = event.target;
    //     console.log(name, value);
    //     setActivity({...activity, [name]: value})
    // }

    if(loadingInitial) return <LoadingComponent content='Loading activity...' />

    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            {/** initialValues and onSubmit are required */}
            <Formik
                validationSchema={validationSchema}
                enableReinitialize 
                initialValues={activity} 
                // values => activity
                onSubmit={values => handleFormSubmit(values)}>
                {/** these 4. props are from formik */}
                {({handleSubmit, isValid, isSubmitting, dirty}) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    {/* <FormField>
                        <Field 
                            placeholder='Title' 
                            name='title'
                        />
                        <ErrorMessage 
                            name='title'
                            render={error => <Label basic color='red' content={error} />}
                        />
                    </FormField> */}
                    <MyTextInput name='title' placeholder='Title' />
                    <MyTextArea rows={3} name='description' placeholder='Description' />
                    <MySelectInput options={categoryOptions} name='category' placeholder='Category' />
                    <MyDateInput name='date' placeholderText='Date' showTimeSelect timeCaption='time' dateFormat='MMMM d, yyyy h:mm aa' />
                    <Header content='Location Details' sub color='teal' />
                    <MyTextInput name='city' placeholder='City' />
                    <MyTextInput name='venue' placeholder='Venue' />
                    <Button 
                        disabled={isSubmitting || !dirty || !isValid}
                        loading={isSubmitting} 
                        floated='right' 
                        positive 
                        type='submit' 
                        content='Submit' 
                    />
                    <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
                </Form>
                )}
            </Formik>
            
        </Segment>
    )
});
