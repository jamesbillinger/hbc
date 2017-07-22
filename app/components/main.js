/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group'
import Login from 'components/login';
import Register from 'components/register';
import Dashboard from 'components/dashboard';
import moment from 'moment';
import About from 'components/about';
import Contact from 'components/contact';
import Schedule from 'components/schedule';
import TopMenu from './topMenu';

export default class Main extends Component {
  render() {
    const { loggedIn } = this.props;
    return (
      <div style={{height:'100%', display:'flex', flexDirection:'column', color:'#212121', fontFamily:'sans-serif'}}>
        <Route component={TopMenu} loggedIn={loggedIn} />
        <div style={{flex:'1 1 auto', width:'100%', position:'relative', minHeight:'400px'}}>
          <Route render={({ location }) => (
            <CSSTransitionGroup transitionName='fade' transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
              <Route location={location} key={location.key}>
                <Switch>
                  <Route path='/login' exact={true} render={(props) => {
                    if (loggedIn) {
                      return <Redirect to='/' />;
                    } else {
                      return <Login {...props} onLoggedIn={::this.onLoggedIn} />;
                    }
                  }} />
                  <Route exact path='/' render={(props) =>
                    <Dashboard {...props} firebaseRef={this.firebaseRef} auth={this.auth} />
                  } />
                  <Route path='/about' render={(props) =>
                    <About {...props} firebaseRef={this.firebaseRef} auth={this.auth} />
                  } />
                  <Route path='/contact' render={(props) =>
                    <Contact {...props} firebaseRef={this.firebaseRef} auth={this.auth} />
                  } />
                  <Route path='/schedule' render={(props) => {
                    if (!loggedIn) {
                      return <Redirect to='/login' />;
                    } else {
                      return <Schedule {...props} firebaseRef={this.firebaseRef} auth={this.auth} />;
                    }
                  }} />
                  <Route render={() => <h3>No Match</h3>} />
                </Switch>
              </Route>
            </CSSTransitionGroup>
          )} />
        </div>
        <div style={{flex:'0 0 40px', color:'#ddd', fontSize:'12px',
                    display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div>Copyright Ⓒ Hays Baseball Club {moment().format('YYYY')}</div>
        </div>
      </div>
    );
  }
}