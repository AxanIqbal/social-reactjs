import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContext } from "./shared/context/AuthContext";
import { useAuth } from "./shared/hooks/auth-hook";
import LinearProgress from "@material-ui/core/LinearProgress";

const Users = React.lazy(() => {
  return import("./user/pages/Users");
});
const NewPlace = React.lazy(() => {
  return import("./places/pages/NewPlace");
});
const UserPlaces = React.lazy(() => {
  return import("./places/pages/UserPlaces");
});
const UpdatePlace = React.lazy(() => {
  return import("./places/pages/Updateplace");
});
const Auth = React.lazy(() => {
  return import("./user/pages/Auth");
});

const App = () => {
  const { token, login, logout, userId, userName } = useAuth();

  let routes;

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeId">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlaces />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        userName: userName,
        login: login,
        logout: logout,
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense
            fallback={
              <div className={"center"}>
                <LinearProgress color="secondary" />
              </div>
            }
          >
            {routes}
          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;

//16
