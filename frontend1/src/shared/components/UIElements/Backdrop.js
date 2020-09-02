import React from 'react';

import './Backdrop.css'
import {createPortal} from "react-dom";

function Backdrop(props) {
    return (
        createPortal(
            <div className={'backdrop'} onClick={props.onClick}/>,
            document.getElementById('backdrop-hook')
        )
    );
}

export default Backdrop;