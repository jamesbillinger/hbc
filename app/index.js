/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from 'components/login';
//import Register from 'components/register';
import Dashboard from 'components/dashboard';
import firebase from 'firebase';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'public/theme.css';
import configureStore from './store';
import * as Actions from 'app/actions';
import moment from 'moment';

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
        <MuiThemeProvider>
          <BrowserRouter>
            <div style={{height:'100%', display:'flex', flexDirection:'column', color:'#212121', fontFamily:'sans-serif'}}>
              <div style={{flex:'0 0 60px', display:'flex', alignItems:'center', justifyContent:'space-between',
                           color:'#000', padding:'0px 50px', fontSize:'18px', marginTop:'35px'}}>
                {/* header */}
                <div style={{display:'flex', alignItems:'center'}}>
                  <div style={{padding:'16px 15px'}}>Home</div>
                  <div style={{padding:'16px 15px'}}>About</div>
                  <div style={{padding:'16px 15px'}}>Contact</div>
                </div>
                <div style={{display:'flex', alignItems:'center'}}>
                  <div style={{padding:'16px 30px'}}>Log In</div>
                  <div style={{padding:'16px 30px', border:'1px solid rgba(0,0,0,0.8)', borderRadius:'30px'}}>Register</div>
                </div>
              </div>
              <div style={{flex:'1 1 auto'}}>
                <Switch>
                  <Route path='/login' exact={true} render={(props) => {
                    if (loggedIn) {
                      return <Redirect to='/' />;
                    } else {
                      return <Login {...props} onLoggedIn={::this.onLoggedIn} />;
                    }
                  }} />
                  <Route path='/' render={(props) =>
                    <Dashboard {...props} firebaseRef={this.firebaseRef} auth={this.auth} />
                  } />
                  <Route path='/schedule' render={(props) => {
                    if (!loggedIn) {
                      return <Redirect to='/login' />;
                    } else {
                      return <Dashboard {...props} firebaseRef={this.firebaseRef} auth={this.auth} />;
                    }
                  }} />
                  <Route render={() => <h3>No Match</h3>} />
                </Switch>
              </div>
              <div style={{flex:'0 0 40px', color:'#ddd', fontSize:'12px',
                          display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div>Copyright Ⓒ Hays Baseball Club {moment().format('YYYY')}</div>
              </div>
            </div>
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