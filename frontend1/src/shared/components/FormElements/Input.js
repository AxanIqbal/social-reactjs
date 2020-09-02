import React, {useContext} from 'react';

import './Input.css'
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import {useHttpClient} from "../../hooks/http-hook";
import {AuthContext} from "../../context/AuthContext";
import ErrorModal from "../UIElements/ErrorModal";
import {useHistory} from 'react-router-dom';
import ImageUpload from "./ImageUpload";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";


function Input(props) {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const auth = useContext(AuthContext);
    const history = useHistory();
    const FILE_SIZE = 1024 * 1024;
    const SUPPORTED_FORMATS = [
        "image/jpg",
        "image/jpeg",
        "image/gif",
        "image/png"
    ];

    const validationSchema2 = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),

        description: Yup.string()
            .min(5, "Min. 5 Character"),

        address: Yup.string()
            .required('Address is required'),

    });

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),

        description: Yup.string()
            .min(5, "Min. 5 Character"),

        address: Yup.string()
            .required('Address is required'),

        image: Yup
            .mixed()
            .required()
            .test(
                "fileSize",
                "File too large",
                (value) => {
                    return value && value.size <= FILE_SIZE
                }
            )
            .test(
                "fileFormat",
                "Unsupported Format",
                value => value && SUPPORTED_FORMATS.includes(value.type)
            )
    });

    return (
        <div className={'place-form'}>
            <Formik
                initialValues={{
                    title: props.title,
                    description: props.description,
                    address: props.address,
                    image: props.image
                }}
                validationSchema={props.update ? validationSchema2 : validationSchema}
                onSubmit={async (values, {setSubmitting}) => {
                    try {
                        const formData = new FormData();
                        formData.append('title', values.title);
                        formData.append('description', values.description);
                        formData.append('address', values.address);
                        if (props.update) {
                            let object = {};
                            formData.forEach((value, key) => {
                                object[key] = value
                            });
                            const json = JSON.stringify(object);
                            await sendRequest(props.url, props.method,
                                json,
                                {
                                    "Content-Type": "application/json",
                                    Authorization: 'Bearer ' + auth.token
                                }
                            );
                        } else {
                            formData.append('image', values.image);
                            await sendRequest(props.url, props.method, formData, {
                                Authorization: 'Bearer ' + auth.token
                            });
                        }
                        setSubmitting(false);
                        history.push('/' + auth.userName + '/places');
                    } catch (e) {
                    }

                }}
            >
                {({
                      values,
                      errors,
                      touched,
                      handleChange,
                      handleBlur,
                      isSubmitting
                  }) => (
                    <React.Fragment>
                        <ErrorModal error={error} onClear={clearError}/>
                        <Backdrop open={isLoading}>
                            <CircularProgress color="inherit"/>
                        </Backdrop>
                        <Form className={`form-control`}>
                            <div className={'form-group'}>
                                {/*<label htmlFor="title">Title</label>*/}
                                {/*<Field type="text" name="title" className={`form-control--textarea`}/>*/}
                                {/*<ErrorMessage name="title" component="div" className={'form-control--invalid'}/>*/}
                                <TextField
                                    name="title"
                                    label="Title"
                                    helperText={touched.title ? errors.title : ""}
                                    error={touched.title && Boolean(errors.title)}
                                    variant="outlined"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.title}
                                    className={`form-control--textarea`}
                                    color="secondary"
                                    style={{display: "flex"}}
                                />
                            </div>

                            <div className={'form-group'}>
                                {/*<label htmlFor="address">Address</label>*/}
                                {/*<Field as="input" name="address" className={`form-control--textarea`}/>*/}
                                {/*<ErrorMessage name="address" component="div" className={'form-control--invalid--p'}/>*/}
                                <TextField
                                    name="address"
                                    label="Address"
                                    helperText={touched.address ? errors.address : ""}
                                    error={touched.address && Boolean(errors.address)}
                                    variant="outlined"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.address}
                                    className={`form-control--textarea`}
                                    color="secondary"
                                    style={{display: "flex"}}
                                />
                            </div>

                            <div className={'form-group'}>
                                {/*<label htmlFor="description">Description</label>*/}
                                <TextField
                                    name="description"
                                    label="Description"
                                    helperText={touched.description ? errors.description : ""}
                                    error={touched.description && Boolean(errors.description)}
                                    multiline
                                    variant="outlined"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.description}
                                    className={`form-control--textarea`}
                                    color="secondary"
                                    style={{display: "flex"}}
                                />
                                {/*<Field as="textarea" name="description" className={`form-control--textarea`} />*/}
                                {/*<ErrorMessage name="description" component="div" className={'form-control--invalid--p'}/>*/}
                            </div>

                            {!props.update && <Field
                                name="image"
                                component={ImageUpload}
                                errorMessage={touched.image ? errors.image : ""}
                                isError={touched.image && Boolean(errors.image)}
                                onChange={handleChange}
                            />}

                            <div className={'form-group'}>
                                <Button className={"background-color-theme"} variant="contained" color="secondary"
                                        type="submit" disabled={isSubmitting}>
                                    {props.btnName}
                                </Button>
                            </div>
                        </Form>
                    </React.Fragment>
                )}
            </Formik>
        </div>
    );
}

export default Input;