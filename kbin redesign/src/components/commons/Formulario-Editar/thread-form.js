import { Field, Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMagazines } from '../../../api/api';
import './form.css';

const ThreadForm = ({ threadID, user, token }) => {
    console.log(token);
    const [magazines, setMagazines] = useState([]);
    const [data, setData] = useState(null);
    const [isDataLoaded, setIsDataLoaded] = useState(false);

    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            if (!threadID) {
                console.error('No thread ID provided');
                return;
            }
            const response = await fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadID}/`);
            if (!response.ok) {
                throw new Error(`Error fetching thread ${threadID}: ${response.statusText}`);
            }
            const threadData = await response.json();
            setData(threadData);
            setIsDataLoaded(true);
        } catch (error) {
            console.error('Error fetching thread:', error);
        }
    };

    useEffect(() => {
        const loadMagazines = async () => {
            try {
                const magazinesData = await fetchMagazines(token,"");
                setMagazines(magazinesData);
            } catch (error) {
                console.error('Error fetching magazines:', error);
            }
        };

        fetchData();
        loadMagazines();
    }, [threadID]);

    const editThread = async (values) => {
        try {
            const response = await fetch(`https://asw-projecte-kbin-social-alphatretze.onrender.com/api/threads/${threadID}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({
                    title: values.title,
                    body: values.description,
                    magazine_name: values.option
                }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            fetchData();
            return data;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    if (!isDataLoaded) {
        return null;
    }

    return (
        <div className="form-container">
            <div className='container2'>
                <Formik
                    initialValues={{
                        title: data.title || '',
                        description: data.body || '',
                        option: data.magazine_name || ''
                    }}
                    onSubmit={(values, { setSubmitting }) => {
                        editThread(values)
                            .then(data => {
                                console.log(data);
                                setSubmitting(false);
                                navigate(`/view-thread/${threadID}`); // Navigate to the view-thread page
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                setSubmitting(false);
                            });
                    }}
                >
                    {({ setFieldValue }) => (
                        <Form className="form-fields">
                            <label htmlFor="title">Title</label>
                            <Field as="textarea" className="form-field textarea-field" id="title" name="title" spellCheck="false" autoCorrect="off" maxLength='255' />

                            <label htmlFor="description">Body</label>
                            <Field as="textarea" className="form-field textarea-field" id="description" name="description" spellCheck="false" autoCorrect="off" maxLength='35000' />

                            <label htmlFor="option">Magazine</label>
                            <Field
                                as="select"
                                className="form-field select-field"
                                id="option"
                                name="option"
                                onChange={(e) => {
                                    const selectedOption = e.target.value;
                                    setFieldValue('option', selectedOption);
                                }}
                            >
                                {magazines.map((magazine, index) => (
                                    <option key={index} value={magazine.name}>{magazine.name}</option>
                                ))}
                            </Field>
                            <button className='button' type="submit">Edit</button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ThreadForm;
