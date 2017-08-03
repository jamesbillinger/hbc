/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import MenuButton from 'components/menuButton';
import Logo from './logo';
import moment from 'moment';
import UpcomingEvents from 'components/upcomingEvents';
import AbsoluteWrapper from 'components/absoluteWrapper';

class Dashboard extends Component {
  render() {
    const { history, location, user, initialLoadComplete } = this.props;
    return (
      <AbsoluteWrapper>
        <div style={{width:'1000px', maxWidth:'100%', margin:'4vh 4vw 0vw 4vw', flex:'1 0 auto',
                     display:'flex', flexDirection:'column', justifyContent:'space-around'}}>
          <div style={{flex:'3 0 8vh'}} />
          <div style={{flex:'1 0 auto', display:'flex', flexDirection:'column', alignItems:'center', minHeight:'300px'}}>
            <Logo text='Hays Baseball Club' />
            <div style={{flex:'1 0 auto', color:'rgba(0,0,0,0.4)', fontSize:'30px', display:'flex', alignItems:'center',
                         animationDelay:'0.5s'}}
                 className='content'>
              <div>Respect. Hard work. Fun.</div>
            </div>
            <div style={{flex:'1 0 auto', minHeight:'50px'}}>
              {initialLoadComplete &&
                <div className='fadein'>
                  {(user ?
                    <MenuButton to='/profile' location={location} className='dashboardButton'
                                style={{padding:'16px 30px', border:'none', borderRadius:'30px', color:'white'}}>
                      View My Profile
                    </MenuButton> :
                    <MenuButton to='/register' location={location} className='dashboardButton'
                                style={{padding:'16px 50px', border:'none', borderRadius:'30px', color:'white'}}>
                      Sign Up
                    </MenuButton>
                  )}
                </div>
              }
            </div>
          </div>
          <div style={{flex:'3 1 auto', display:'flex', justifyContent:'center'}}>
            <UpcomingEvents />
          </div>
        </div>
      </AbsoluteWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.hbc.user,
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
)(Dashboard);