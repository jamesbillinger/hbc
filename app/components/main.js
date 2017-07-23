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
import moment from 'moment';
import About from 'components/about';
import Contact from 'components/contact';
import Schedule from 'components/schedule';
import TopMenu from './topMenu';
import firebase from 'firebase';

class Main extends Component {
  componentWillMount() {
    const { actions } = this.props;
    firebase.auth().onAuthStateChanged(::actions.onAuthStateChanged);
  }

  render() {
    const { user } = this.props;
    return (
      <div style={{height:'100%', display:'flex', flexDirection:'column', color:'#212121', fontFamily:'sans-serif'}}>
        <Route component={TopMenu} />
        <div style={{flex:'1 1 auto', width:'100%', position:'relative', minHeight:'400px'}}>
          <Route render={({ location }) => (
            <CSSTransitionGroup transitionName='fade' transitionEnterTimeout={1000} transitionLeaveTimeout={1000}>
              <Route location={location} key={location.key}>
                <Switch>
                  <Route exact={true} path='/' render={(props) =>
                    <Dashboard {...props} />
                  } />
                  <Route path='/about' render={(props) =>
                    <About {...props} />
                  } />
                  <Route path='/contact' render={(props) =>
                    <Contact {...props} />
                  } />
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
                      return <Redirect to='/' />;
                    } else {
                      return <Register {...props} />;
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