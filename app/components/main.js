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
import PasswordReset from 'components/passwordReset';

class Main extends Component {
  componentWillMount() {
    const { actions } = this.props;
    firebase.auth().onAuthStateChanged(::actions.onAuthStateChanged);
  }

  componentDidMount() {
    const { actions, faqs } = this.props;
    if (!faqs) {
      actions.fetchFAQs();
    }
  }

  render() {
    const { user, groups, location, initialLoadComplete, actions } = this.props;
    return (
      <CSSTransitionGroup transitionName='fade' transitionEnterTimeout={500} transitionLeaveTimeout={500}>
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
              if (!initialLoadComplete) {
                return <div />;
              } else if (user) {
                return <Redirect to='/' />;
              } else {
                return <Login {...props} />;
              }
            }} />
            <Route path='/password-reset' render={(props) => {
              if (!initialLoadComplete) {
                return <div />;
              } else {
                return <PasswordReset {...props} />;
              }
            }} />
            <Route path='/register' render={(props) => {
              if (!initialLoadComplete) {
                return <div/>;
              } else if (user) {
                return <Redirect to='/profile' />;
              } else {
                return <Register {...props} />;
              }
            }} />
            <Route path='/admin' render={(props) => {
              if (user && groups && groups.admin[user.uid]) {
                return <Admin {...props} />;
              } else if (initialLoadComplete) {
                return <Redirect to='/' />;
              } else {
                return <div />;
              }
            }} />
            <Route path='/profile' render={(props) => {
              if (user) {
                return <Profile {...props} />;
              } else if (initialLoadComplete) {
                return <Redirect to='/' />;
              } else {
                return <div />;
              }
            }} />
            <Route path='/validate' render={(props) => {
              if (!initialLoadComplete) {
                return <div/>;
              } else if (user) {
                if (user.emailVerified) {
                  return <Redirect to='/profile'/>;
                } else {
                  if (props.search && props.search.oobCode) {
                    actions.applyActionCode(user.uid, props.search.mode, props.search.oobCode, () => {
                      return <Redirect to='/profile'/>;
                    })
                  } else {
                    return <Redirect to='/profile'/>;
                  }
                }
              } else {
                return <Redirect to='/login' search={props.location.search} />;
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
    user: state.hbc.user,
    groups: state.hbc.groups,
    faqs: state.hbc.faqs,
    initialLoadComplete: state.hbc.initialLoadComplete
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