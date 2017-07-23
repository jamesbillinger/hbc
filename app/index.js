/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group'
import firebase from 'firebase';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import materialTheme from './materialTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import 'public/fonts/index.css';
import 'public/theme.css';
import configureStore from './store';
import Main from 'components/main';

const store  = configureStore({});

class App extends Component {
  state = {};

  componentWillMount() {
    injectTapEventPlugin();
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          loggedIn:true
        });
      } else {
        this.setState({
          loggedIn:false
        });
      }
    });
  }

  logout() {
    firebase.auth().signOut().then(() => {
      // Sign-out successful.
      //this.setState({loggedIn: false});
    }, (error) => {
      console.log(error);
    });
  }

  onLoggedIn() {
    this.setState({
      loggedIn: true
    })
  }

  render() {
    const { loggedIn } = this.state;
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(materialTheme)}>
          <BrowserRouter>
            <Main />
          </BrowserRouter>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);