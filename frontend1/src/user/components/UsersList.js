import React from 'react';

import UserItem from './UserItem';
import './UsersList.css';
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";

function UsersList(props) {
    if (props.items.length === 0) {
        return (
            <div className="center">
                <Card>
                    <h2>No users found.</h2>
                </Card>
            </div>
        );
    }

    return (
        <List className="users-list">
            {props.items.map(user => (
                <UserItem
                    key={user.id}
                    id={user.id}
                    userName={user.userName}
                    image={user.image}
                    name={user.name}
                    placeCount={user.places.length}
                />
            ))}
        </List>
    );
}

export default UsersList;
