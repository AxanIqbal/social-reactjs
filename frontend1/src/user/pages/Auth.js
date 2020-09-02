import React, {useContext, useState} from 'react';

import './Auth.css'
import {Card} from "@material-ui/core";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import CardHeader from "@material-ui/core/CardHeader";
import {AuthContext} from "../../shared/context/AuthContext";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {useHttpClient} from '../../shared/hooks/http-hook';
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

const validationSchema_signIn = Yup.object().shape({
    userName: Yup.string()
        .required("UserName is required")
        .min(3, "min 3 char required"),
    password: Yup.string()
        .min(5, "min length is 5 chars")
        .required("password is required"),
});

function Auth(props) {
    const auth = useContext(AuthContext);
    const [isLoginMode, setIsLoginMode] = useState(true);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const FILE_SIZE = 1024 * 1024;
    const SUPPORTED_FORMATS = [
        "image/jpg",
        "image/jpeg",
        "image/gif",
        "image/png"
    ]

    const validationSchema_signUp = Yup.object().shape({
        name: Yup.string()
            .required("Name is required"),
        userName: Yup.string()
            .required("UserName is required")
            .min(3, "min 3 char required"),
        email: Yup.string()
            .email()
            .required("UserName is required"),
        password: Yup.string()
            .min(6, "min length is 6 chars")
            .required("password is required"),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Password does not match')
            .required("Confirm your password"),
        image: Yup
            .mixed()
            .required()
            .test(
                "fileSize",
                "File too large",
                value => value && value.size <= FILE_SIZE
            )
            .test(
                "fileFormat",
                "Unsupported Format",
                value => value && SUPPORTED_FORMATS.includes(value.type)
            )
    });

    function switchModeHandler() {
        setIsLoginMode(prevMode => !prevMode);
    }

    return (
        <Formik
            initialValues={{
                name: props.name,
                userName: props.username,
                email: props.email,
                password: '',
                passwordConfirmation: '',
                image: null
            }}
            validationSchema={isLoginMode ? validationSchema_signIn : validationSchema_signUp}
            onSubmit={async (values, {setSubmitting}) => {
                if (isLoginMode) {
                    try {
                        const responseData = await sendRequest(
                            process.env.REACT_APP_BACKEND_URL + '/users/login',
                            'POST',
                            JSON.stringify({
                                userName: values.userName,
                                password: values.password
                            }),
                            {
                                'Content-Type': 'application/json'
                            }
                        );
                        auth.login(responseData.userId, responseData.userName, responseData.token);
                    } catch (e) {
                    }
                } else {
                    try {
                        const formData = new FormData();
                        formData.append('email', values.email);
                        formData.append('name', values.name);
                        formData.append('userName', values.userName);
                        formData.append('password', values.password);
                        formData.append('image', values.image);
                        const responseData = await sendRequest(
                            process.env.REACT_APP_BACKEND_URL + '/users/signup',
                            'POST',
                            formData
                        );

                        auth.login(responseData.userId, responseData.userName, responseData.token);
                    } catch (err) {
                    }
                }
                setSubmitting(false);
            }}
        >
            {({
                  values,
                  errors,
                  touched,
                  handleChange,
                  handleBlur,
                  isSubmitting,
                  setFieldValue,
              }) => (
                <Form>
                    <ErrorModal error={error} onClear={clearError} handleOpen/>
                    <Backdrop open={isLoading}>
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                    <Card className={"card--container"}>
                        <CardHeader title={isLoginMode ? "Log-In" : "Sign-Up"} className={'center'}/>
                        <CardContent>
                            <Grid
                                container
                                spacing={3}
                                alignItems={"center"}
                            >
                                {!isLoginMode && <Grid item xs={12} sm={6}>
                                    <TextField
                                        name={'name'}
                                        label={'name'}
                                        helperText={touched.name ? errors.name : ""}
                                        error={touched.name && Boolean(errors.name)}
                                        variant={"outlined"}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.name}
                                        color={"secondary"}
                                        style={{width: "100%"}}
                                    />
                                </Grid>}
                                {!isLoginMode && <Grid item xs={12} sm={6}>
                                    <Field
                                        name="image"
                                        component={ImageUpload}
                                        errorMessage={touched.image ? errors.image : ""}
                                        isError={touched.image && Boolean(errors.image)}
                                    />
                                </Grid>}
                            </Grid>
                            <Grid
                                container
                                spacing={3}
                                alignItems={"center"}
                            >
                                {/*<Grid item xs={12}>*/}
                                {/*    <Typography variant={'h2'} align={"center"}>Sign Up</Typography>*/}
                                {/*</Grid>*/}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name={'userName'}
                                        label={'username'}
                                        helperText={touched.userName ? errors.userName : ""}
                                        error={touched.userName && Boolean(errors.userName)}
                                        variant={"outlined"}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.userName}
                                        color={"secondary"}
                                        style={{width: "100%"}}
                                        autoComplete={"username"}
                                    />
                                </Grid>
                                {!isLoginMode && <Grid item xs={12} sm={6}>
                                    <TextField
                                        name={'email'}
                                        label={'email'}
                                        type={'email'}
                                        helperText={touched.email ? errors.email : ""}
                                        error={touched.email && Boolean(errors.email)}
                                        variant={"outlined"}
                                        color={"secondary"}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.email}
                                        style={{width: "100%"}}
                                        disabled={isLoginMode}
                                        autoComplete={"email"}
                                    />
                                </Grid>}
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="password"
                                        label="password"
                                        type={'password'}
                                        helperText={touched.password ? errors.password : ""}
                                        error={touched.password && Boolean(errors.password)}
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.password}
                                        color="secondary"
                                        style={{width: "100%"}}
                                        autoComplete={"current-password"}
                                    />
                                </Grid>
                                {!isLoginMode && <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="passwordConfirmation"
                                        label="Confirm Password"
                                        type={'password'}
                                        helperText={touched.passwordConfirmation ? errors.passwordConfirmation : ""}
                                        error={touched.passwordConfirmation && Boolean(errors.passwordConfirmation)}
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.passwordConfirmation}
                                        color="secondary"
                                        style={{width: "100%"}}
                                        disabled={isLoginMode}
                                    />
                                </Grid>}
                            </Grid>
                        </CardContent>
                        <CardActions className={'center'}>
                            <Button variant="contained" className={"background-color-theme"} color="secondary"
                                    type="submit" disabled={isSubmitting}>
                                {isLoginMode ? "LogIn" : "SignUp"}
                            </Button>
                            <Button variant="outlined" color="secondary" onClick={switchModeHandler}>
                                {isLoginMode ? "Switch to SignUp" : "Switch to LogIn"}
                            </Button>
                        </CardActions>
                    </Card>
                </Form>
            )}
        </Formik>
    );
}

export default Auth;