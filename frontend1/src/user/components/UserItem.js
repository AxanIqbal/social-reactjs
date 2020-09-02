import React from 'react';


import './UserItem.css';
import Avatar from "@material-ui/core/Avatar";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";
import Card from "@material-ui/core/Card";

const useStyles = makeStyles((theme) => ({
    avatar: {
        width: theme.spacing(9),
        height: theme.spacing(9),
    }
}));

const UserItem = props => {
    const classes = useStyles();
    return (
        <li className="user-item">
            <Card className="user-item__content" component={Link} to={`/${props.userName}/places`}>
                {/*<Link to={`/${props.userName}/places`}>*/}
                <div className="user-item__image">
                    <Avatar src={`${process.env.REACT_APP_ASSET_URL}/${props.image}`} alt={props.name}
                            className={classes.avatar}/>
                </div>
                {/*<Divider orientation="vertical" flexItem/>*/}
                <div className="user-item__info" align={'center'}>
                    <Typography variant={"h2"}>{props.name}</Typography>
                    <Typography variant={"h5"}>
                        {props.placeCount} {props.placeCount === 1 ? 'Place' : 'Places'}
                    </Typography>
                </div>
            </Card>
        </li>
    );
};

export default UserItem;
