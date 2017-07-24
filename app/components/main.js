/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group'
import Login from 'components/login';
import Register from 'components/register';
import Dashboard from 'components/dashboard';
import About from 'components/about';
import Contact from 'components/contact';
import Schedule from 'components/schedule';
import firebase from 'firebase';
import Admin from 'components/admin';
import Profile from 'components/profile';

class Main extends Component {
  componentWillMount() {
    const { actions } = this.props;
    firebase.auth().onAuthStateChanged(::actions.onAuthStateChanged);
  }

  render() {
    const { user, location } = this.props;
    return (
      <CSSTransitionGroup transitionName='fade' transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
        <Route location={location} key={location.key}>
          <Switch>
            <Route exact={true} path='/' render={(props) => <Dashboard {...props} />} />
            <Route path='/about' render={(props) => <About {...props} />} />
            <Route path='/contact' render={(props) => <Contact {...props} />} />
            <Route path='/schedule' render={(props) => {
              if (!user) {
                return <Redirect to='/login' />;
              } else {
                return <Schedule {...props} />;
              }
            }} />
            <Route path='/login' render={(props) => {
              if (user) {
                return <Redirect to='/' />;
              } else {
                return <Login {...props} />;
              }
            }} />
            <Route path='/register' render={(props) => {
              if (user) {
                return <Redirect to='/profile' />;
              } else {
                return <Register {...props} />;
              }
            }} />
            <Route path='/admin' render={(props) => {
              if (user && user.admin) {
                return <Admin {...props} />;
              } else {
                return <Redirect to='/' />;
              }
            }} />
            <Route path='/profile' render={(props) => {
              if (user) {
                return <Profile {...props} />;
              } else {
                return <Redirect to='/' />;
              }
            }} />
            <Route render={() => <div />} />
          </Switch>
        </Route>
      </CSSTransitionGroup>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.hbc && state.hbc.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({...Actions}, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Main);