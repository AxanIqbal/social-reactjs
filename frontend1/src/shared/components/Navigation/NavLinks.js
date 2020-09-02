import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";
import { AuthContext } from "../../context/AuthContext";
import Button from "@material-ui/core/Button";
import { Typography } from "@material-ui/core";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);

  return (
    <List className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
        <Divider />
      </li>
      {auth.isLoggedIn && (
        <li>
          <Typography component={NavLink} to={`/${auth.userName}/places`}>
            MY PLACES
          </Typography>
          <Divider />
          {/* <NavLink to={`/${auth.userName}/places`}>MY PLACES</NavLink>*/}
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <Typography component={NavLink} to={"/places/new"}>
            ADD PLACE
          </Typography>
          <Divider />
          {/*<NavLink to="/places/new">ADD PLACE</NavLink>*/}
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <Typography component={NavLink} to={"/auth"}>
            LOGIN
          </Typography>
          <Divider />
          {/*<NavLink to="/auth">LOGIN</NavLink>*/}
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <Button onClick={auth.logout} color={"#ffa36c"}>
            LOGOUT
          </Button>
        </li>
      )}
    </List>
  );
};

export default NavLinks;
