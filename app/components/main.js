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
import ForgotPassword from 'components/forgotPassword';
import ResetPassword from 'components/resetPassword';
import qs from 'query-string';

class Main extends Component {
  componentWillMount() {
    const { actions } = this.props;
    firebase.auth().onAuthStateChanged(::actions.onAuthStateChanged);
  }

  componentDidMount() {
    const { actions, faqs, location, history, user } = this.props;
    if (!faqs) {
      actions.fetchFAQs();
    }
    let query = qs.parse(location.search);
    if (user && query && query.oobCode) {
      this._handledQuery = true;
      actions.applyActionCode(user.uid, query.mode, query.oobCode, () => {
        history.push('/profile');
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { location, user, actions, history } = this.props;
    let query = qs.parse(location.search);
    if (!this._handledQuery && user && query && query.oobCode) {
      this._handledQuery = true;
      actions.applyActionCode(user.uid, query.mode, query.oobCode, () => {
        if (query.mode === 'resetPassword') {
          history.push('/resetpassword');
        } else {
          history.push('/profile');
        }
      });
    }
  }

  render() {
    const { user, groups, location, initialLoadComplete, actions, history } = this.props;
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
            <Route path='/forgotpassword' render={(props) => {
              if (!initialLoadComplete) {
                return <div/>;
              } else {
                return <ForgotPassword {...props} />;
              }
            }} />
              <Route path='/resetpassword' render={(props) => {
                if (!initialLoadComplete) {
                  return <div />;
                } else if (user) {
                  return <ResetPassword {...props} initialValues={user}/>;
                } else {
                  return <Redirect to='/login' />;
                }
              }} />
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