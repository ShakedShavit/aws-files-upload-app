import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import LoginContextProvider from '../../context/loginContext';
import HomePage from '../home/HomePage';
import LoginPage from '../login/LoginPage';
import LoginRoute from './LoginRoute';
import PageNotFound from '../not-found/PageNotFound';
import HomeRoute from './HomeRoute';

const AppRouter = () => {
    return (
        <BrowserRouter>
            <LoginContextProvider>
                <Switch>
                    <Route path="/" exact>
                        <Redirect to="/home" />
                    </Route>
                    <HomeRoute path="/home" component={HomePage} />
                    <LoginRoute path="/login" component={LoginPage} />
                    <Route path="*" component={PageNotFound} />
                </Switch>
            </LoginContextProvider>
        </BrowserRouter>
    )
};

export default AppRouter;