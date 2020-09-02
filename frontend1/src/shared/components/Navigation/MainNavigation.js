import React, { useState } from "react";

import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import { Hidden, SwipeableDrawer } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import Divider from "@material-ui/core/Divider";

function MainNavigation(props) {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);
  const iOS = process.browser && /iPad|iPhone|iPod/.test(navigator.userAgent);

  function openDrawer() {
    setDrawerIsOpen(true);
  }

  function closeDrawer() {
    setDrawerIsOpen(false);
  }

  return (
    <React.Fragment>
      <Hidden only={["xl", "lg", "md"]}>
        <SwipeableDrawer
          onClose={closeDrawer}
          onOpen={openDrawer}
          open={drawerIsOpen}
          disableBackdropTransition={!iOS}
          disableDiscovery={iOS}
        >
          <nav className={"main-navigation__drawer-nav"}>
            <Typography
              variant="h4"
              component={Link}
              to={"/"}
              className={"center main-navigation__title"}
            >
              My Places
            </Typography>
            <NavLinks />
          </nav>
        </SwipeableDrawer>
      </Hidden>
      <AppBar
        position={"sticky"}
        id={"main-navigation__appBar"}
        style={{ marginBottom: "1rem" }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            id={"main-navigation__menu-btn"}
            color="inherit"
            aria-label="menu"
            onClick={openDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h4"
            className="main-navigation__title"
            component={Link}
            to={"/"}
          >
            My Places
          </Typography>
          <Divider
            orientation="vertical"
            flexItem
            className={"main-navigation__divider"}
          />
          <nav className={"main-navigation__header-nav"}>
            <NavLinks />
          </nav>
        </Toolbar>
      </AppBar>
      {/*</MainHeader>*/}
    </React.Fragment>
  );
}

export default MainNavigation;
