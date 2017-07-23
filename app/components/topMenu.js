/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { CSSTransitionGroup } from 'react-transition-group'
import MenuButton from 'components/menuButton';
import Icon from 'components/icon';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

class Main extends Component {
  render() {
    const { user, location, actions } = this.props;
    return (
      <header className='header'
           style={{flex:'0 0 60px', display:'flex', alignItems:'center', justifyContent:'space-between',
                   padding:'0px 50px', fontSize:'18px', marginTop:'35px'}}>
        {/* header */}
        <nav style={{display:'flex', alignItems:'center'}}>
          <MenuButton to='/' location={location}>Home</MenuButton>
          <MenuButton to='/about' location={location}>About</MenuButton>
          <MenuButton to='/contact' location={location}>Contact</MenuButton>
        </nav>
        <nav style={{display:'flex', alignItems:'center'}}>
          {!user && <MenuButton to='/login' location={location} >Log In</MenuButton>}
          {!user && location.pathname !== '/register' &&
            <MenuButton to='/register' location={location}
                        style={{padding:'16px 30px', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'30px', color:'#000'}}>
              Register
            </MenuButton>
          }
          {user &&
            <IconMenu iconButtonElement={<Icon icon='account_circle' />}>
              <MenuItem primaryText='Manage my profile' />
              <Divider />
              <MenuItem primaryText='Sign out' onTouchTap={::actions.logout} />
            </IconMenu>
          }
        </nav>
      </header>
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