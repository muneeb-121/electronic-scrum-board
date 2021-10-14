import React, { useEffect } from "react";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom"
import MainBoard from "./components/MainBoard";
import Login from "./components/Login";
import Projects from "./components/Projects";
import Layout from "./Layouts";
import { initStore, tokenisValid } from "./store";

const routes = [
    {
        path: "/",
        exact: true,
        main: Login
    },
    {
        path: "/login",
        exact: true,
        main: Login
    },
    {
        path: "/projects",
        authRequired: true,
        main: Projects
    },
    {
        path: "/projects/:projectId",
        authRequired: true,
        main: MainBoard
    }
  ];

const App = () => {
    useEffect(() => {
        initStore()
    }, [])
    return (
        <BrowserRouter>
            <Switch>
                {routes.map((route, index) => {
                    if (route.authRequired) {
                        return (
                        <PrivateRoute
                            key={index}
                            path={route.path}
                            exact={true}
                        >
                          <Layout>
                            <route.main/>
                          </Layout>
                        </PrivateRoute>
                        ) 
                    }
                    return (<Route
                        key={index}
                        path={route.path}
                        exact={true}
                        component={route.main}
                    />)
                })}
            </Switch>
        </BrowserRouter>
    );
};

function PrivateRoute ({ children, ...rest }) {
    let auth = tokenisValid();
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }

export default App;