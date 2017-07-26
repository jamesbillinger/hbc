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

class Dashboard extends Component {
  render() {
    const { history, location, user, initialLoadComplete } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center'}}>
        <div style={{width:'1000px', maxWidth:'100%', margin:'4vw',
                     display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-around'}}>
          <div style={{flex:'2 1 auto'}} />
          <Logo text='Hays Baseball Club' />
          <div style={{flex:'1 0 auto', color:'rgba(0,0,0,0.4)', fontSize:'30px', display:'flex', alignItems:'center'}}>
            <div style={{}}>Respect. Hard work. Fun.</div>
          </div>
          <div style={{flex:'1 0 auto', minHeight:'50px'}}>
            {initialLoadComplete &&
              <div className='fadein'>
                {(user ?
                  <MenuButton to='/profile' location={location} className='dashboardButton'
                              style={{padding:'16px 30px', border:'none', borderRadius:'30px', color:'white'}}>
                    View My Profile
                  </MenuButton> :
                  <MenuButton to='/register' location={location}
                              style={{padding:'16px 50px', border:'none', borderRadius:'30px', color:'white',
                                backgroundColor: '#8BC34A'}}>
                    Sign Up
                  </MenuButton>
                )}
              </div>
            }
          </div>
          <div style={{flex:'1 1 auto'}} />
        </div>
      </div>
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