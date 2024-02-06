import React from 'react';

import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Home from '../pages/Home';

const Routes: React.FC = () => (
  <Switch>
    <Route path='/' exact component={SignIn} />
    <Route path='/signup' exact component={SignUp} />

    <Route path='/Home' component={Home} isPrivate />
  </Switch>
);

export default Routes;
