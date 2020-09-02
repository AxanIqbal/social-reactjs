import React, {useContext, useState} from 'react';
import './PlaceItem.css';
import Map from "../../shared/components/UIElements/Map";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Divider from "@material-ui/core/Divider";
import CModal from "../../shared/components/UIElements/Modal"
import {AuthContext} from "../../shared/context/AuthContext";
import {Link as RouterLink} from 'react-router-dom';
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

function PlaceItem(props) {
    const [showMap, setShowMap] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const showDeleteWarningHandler = () => {
        setShowConfirm(true);
    };

    const cancelDeleteHandler = () => {
        setShowConfirm(false);
    };

    const confirmDeleteHandler = async () => {
        setShowConfirm(false);
        try {
            await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/${props.id}`, "DELETE", null, {
                Authorization: 'Bearer ' + auth.token
            })
            props.onDelete(props.id);
        } catch (e) {
        }
    };

    function openMapHandler() {
        setShowMap(true);
    }

    function closeMapHandler() {
        setShowMap(false);
    }

    return (
        <React.Fragment>
            <CModal
                show={showMap}
                onCancel={closeMapHandler}
                header={props.address}
                contentClass="place-item__modal-content"
                footerClass="place-item__modal-actions"
                footer={<Button className={"background-color-theme"} onClick={closeMapHandler}>CLOSE</Button>}
            >
                <div className="map-container">
                    <Map center={props.coordinates} zoom={16}/>
                </div>
            </CModal>
            <CModal
                show={showConfirm}
                onCancel={cancelDeleteHandler}
                header="Are you sure?"
                footerClass="place-item__modal-actions"
                footer={
                    <React.Fragment>
                        <Button className={"background-color-theme"} variant={"outlined"} color={"inherit"}
                                onClick={cancelDeleteHandler}>
                            CANCEL
                        </Button>
                        <Button variant={"contained"} color={"secondary"} onClick={confirmDeleteHandler}>
                            DELETE
                        </Button>
                    </React.Fragment>
                }
            >
                <p>
                    Do you want to proceed and delete this place? Please note that it
                    can't be undone thereafter.
                </p>
            </CModal>
            <li className="place-item">
                <Card className="place-item__content">
                    <ErrorModal error={error} onClear={clearError} handleOpen/>
                    {isLoading && <Backdrop open={isLoading}>
                        <CircularProgress color="inherit"/>
                    </Backdrop>}
                    <div className="place-item__image">
                        <img src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.title}/>
                    </div>
                    <CardContent>
                        <div className="place-item__info">
                            <Typography variant={'h3'}>{props.title}</Typography>
                            <Typography variant={'h4'}>{props.address}</Typography>
                            <Typography>{props.description}</Typography>
                        </div>
                    </CardContent>
                    <Divider/>
                    <CardActions>
                        <div className="place-item__actions">
                            <Button className={"background-color-theme"} variant="contained" color={'secondary'}
                                    onClick={openMapHandler}>VIEW ON
                                MAP</Button>
                            {auth.userId === props.creatorId && (<Button variant="contained" component={RouterLink}
                                                                         to={`/places/${props.id}`}>EDIT</Button>)}
                            {auth.userId === props.creatorId && <Button variant="contained" color={'secondary'}
                                                                        onClick={showDeleteWarningHandler}>DELETE</Button>}
                        </div>
                    </CardActions>
                </Card>
            </li>
        </React.Fragment>
    );
}

export default PlaceItem;
