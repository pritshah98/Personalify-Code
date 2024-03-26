import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import './App.css';
import Landing from './components/layout/Landing';
import { PersistGate } from 'redux-persist/integration/react';
import RedirectURI from './components/layout/RedirectURI';
import { Provider } from 'react-redux';
import store from './store';
import QuizContainter from './components/questions/QuizContainter';
import Result from './components/result/Result';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

const App = () => {
  return (
    <Provider store={store}>
      <AlertProvider template={AlertTemplate}>
        <Router>
          <Switch>
            <Route exact path='/' component={withRouter(Landing)} />
            <Route
              path='/spotifyapp/quiz'
              component={withRouter(QuizContainter)}
            />
            <Route
              path='/spotifyapp/redirect'
              component={withRouter(RedirectURI)}
            />
            <Route path='/spotifyapp/result' component={withRouter(Result)} />
          </Switch>
        </Router>
      </AlertProvider>
    </Provider>
  );
};

export default App;
