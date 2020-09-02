import React, {useEffect, useState} from 'react';
import PlaceList from "../components/PlaceList";
import {useParams} from 'react-router-dom';
import {useHttpClient} from "../../shared/hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";


function UserPlaces(props) {
    const userId = useParams().userId;
    const [loadedPlaces, setLoadedPlaces] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + `/places/user/${userId}`);
                setLoadedPlaces(responseData.place);
            } catch (e) {
            }
        }
        fetchPlaces();
    }, [sendRequest, userId])

    function placeDeletedHandler(deletedPlaceId) {
        setLoadedPlaces(prevPlaces =>
            prevPlaces.filter(place => place.id !== deletedPlaceId)
        );
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <Backdrop open={isLoading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler}/>}
        </React.Fragment>
    );
}

export default UserPlaces;