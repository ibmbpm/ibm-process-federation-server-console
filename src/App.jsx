/*
 Copyright IBM Corp. 2023
*/

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Theme, Content } from '@carbon/react';
import AppHeader from './components/AppHeader';
import LandingPage from './content/LandingPage';
import MonitoringPage from './content/MonitoringPage';
import './app.scss';
import RuntimedataContextProvider from './contexts/RuntimedataContextProvider';

function App() {
  return (
    <>
      <Theme theme="g100">
        <AppHeader />
      </Theme>
      <Content>
        <Theme theme="white">
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <RuntimedataContextProvider>
            <Route path="/monitoring" component={MonitoringPage} />
          </RuntimedataContextProvider>
        </Switch>
        </Theme>
      </Content>
    </>
  );
}

export default App;
