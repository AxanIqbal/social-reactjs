import React, {useEffect, useState} from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import {useHttpClient} from "../../shared/hooks/http-hook";
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";

function Users() {
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedUsers, setLoadedUsers] = useState();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users');

                setLoadedUsers(responseData.users);
            } catch (e) {
            }
        }

        fetchUsers();
    }, [sendRequest])


    return (
        <React.Fragment>
        <ErrorModal error={error} onClear={clearError}/>
            <Backdrop open={isLoading}>
                <CircularProgress color="inherit"/>
            </Backdrop>
            {!isLoading && loadedUsers && <UsersList items={loadedUsers}/>}
        </React.Fragment>
    )
}

export default Users;
