import React, {useEffect, useState} from 'react';
import Input from "../../shared/components/FormElements/Input";
import {Link, useParams} from 'react-router-dom';
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {Card} from "@material-ui/core";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Divider from "@material-ui/core/Divider";
import "./UpdatePlace.css"
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

function UpdatePlace(props) {
    const placeId = useParams().placeId;
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`);
                setLoadedPlace(responseData.place);
            } catch (e) {
            }
        }
        fetchPlace();
    }, [sendRequest, placeId])

    if (!loadedPlace) {
        return (
            <Container>
                <Card className={"center--card"}>
                    <CardContent>
                        <Typography variant={"h3"} className={"center"}>Could not find place! Create one ?</Typography>
                    </CardContent>
                    <Divider/>
                    <CardActions>
                        <Button variant={"contained"} className={"background-color-theme"} color={"secondary"}
                                component={Link} to={"/places/new"}
                                id={'Button--center'}>Create</Button>
                    </CardActions>
                </Card>
            </Container>
        );
    }

    function Update(values) {
        console.log(values);
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <Backdrop open={isLoading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            {!isLoading && loadedPlace && <Input title={loadedPlace.title} description={loadedPlace.description}
                                                 address={loadedPlace.address} btnName={"Edit"} onClick={Update}
                                                 method={"PATCH"}
                                                 url={`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`}
                                                 update={true}
            />}
        </React.Fragment>
    );
}

export default UpdatePlace;