import React, { useState } from 'react';
import { Container, Card, Col, Row, Button } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { emailRegex } from './../../services/Regex';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css' // If using WebPack and style-loader.
import { sendEmails } from '../../services/sendEmail';

const EmailForm = () => {

    const [emails, setEmails] = useState([]);
    const [isErrorExist, setIsErrorExist] = useState(true);
    const initialValues = {
        from: '',
        to: '',
        subject: '',
        body: ''
    };

    const checkEmails = (emails) => {
        let res = true;
        if(!emails.length) {
            return false;
        }

        emails.forEach(email => {
            if (!emailRegex.test(email)) {
                console.log(email, emailRegex.test(email));
                res = false;
            }
        });

        setIsErrorExist(res);
        return res;
    }

    const validate = (values) => {
        const errors = {};
        if (!emailRegex.test(values.from)) {
            errors.from = 'Invalid sender email';
        }

        if (!checkEmails(emails)) {
            errors.to = 'Invalid receiver emails';
        }

        if (!values.subject) {
            errors.subject = 'subject is required';
        }

        if (!values.body) {
            errors.body = 'body is required';
        }

        errors && Object.keys(errors).length !== 0 ? setIsErrorExist(true) : setIsErrorExist(false);
        return errors;
    }

    const handleSubmit = (values) => {
        sendEmails(values.from, emails, values.subject, values.body)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
    }

    return (
        <Container className='p-5'>
            <Card className='text-center'>
                <Card.Header>
                    Email Template
                </Card.Header>
                <Formik
                    initialValues={initialValues}
                    validate={values => validate(values)}
                    onSubmit={values => handleSubmit(values)}
                >
                    <Form>
                        <Row className='form-group mt-2'>
                            <label className='col-sm-2 col-form-label'>From</label>
                            <Col className='col-sm-8' style={{textAlign: 'left'}}>
                                <Field type='text' className='form-control' name='from' placeholder='email@example.com' />
                                <ErrorMessage name="from" />
                            </Col>
                        </Row>

                        <Row className='form-group mt-2'>
                            <label className='col-sm-2 col-form-label'>To</label>
                            <Col className='col-sm-8' style={{textAlign: 'left'}}>
                                <TagsInput inputProps = {{placeholder:'add email'}} name='to' value={emails} onChange={(tags) => setEmails(tags)} />
                                <ErrorMessage name="to" />
                            </Col>
                        </Row>

                        <Row className='form-group mt-2'>
                            <label className='col-sm-2 col-form-label'>Subject</label>
                            <Col className='col-sm-8' style={{textAlign: 'left'}}>
                                <Field type='text' className='form-control' name='subject' placeholder='Subject' />
                                <ErrorMessage name="subject" />
                            </Col>
                        </Row>

                        <Row className='form-group mt-2'>
                            <label className='col-sm-2 col-form-label'>Body</label>
                            <Col className='col-sm-8' style={{textAlign: 'left'}}>
                                <Field name="message" as="textarea" rows='12' name='body' className="form-control" />
                                <ErrorMessage name="body" />
                            </Col>
                        </Row>

                        <Row style={{float: 'right', marginRight: '20%', width: '20%'}}>
                            <Button className='m-5' variant="primary" type="submit" disabled={isErrorExist}>
                                Send
                            </Button>
                        </Row>
                    </Form>
                </Formik>
            </Card>
        </Container>
    );
}

export default EmailForm;