import React from 'react';
import './NewPlace.css';
import Input from "../../shared/components/FormElements/Input";


const NewPlace = () => {
    return (
        <Input url={process.env.REACT_APP_BACKEND_URL + '/places'} method={'POST'} btnName={"ADD PLACE"}/>
    );
};

export default NewPlace;