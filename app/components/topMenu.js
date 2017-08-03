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
import { Link } from 'react-router-dom';

class Main extends Component {
  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (location.pathname !== prevProps.location.pathname) {
      let p = location.pathname;
      if (p === '' || p === '/') {
        document.title = 'Hays Baseball Club';
      } else if (p.startsWith('/about')) {
        document.title = 'Hays Baseball Club - Who and what we are';
      } else if (p.startsWith('/contact')) {
        document.title = 'Hays Baseball Club - Contact Us';
      } else if (p.startsWith('/register')) {
        document.title = 'Hays Baseball Club - Register';
      } else if (p.startsWith('/login')) {
        document.title = 'Hays Baseball Club - Login';
      } else {
        document.title = 'Hays Baseball Club - Admin';
      }
    }
  }

  render() {
    const { user, groups, location, actions, initialLoadComplete } = this.props;
    let passwordText;
    if (user && user.provider === 'google.com') {
      passwordText =
        <a style={{width:'100%', height:'100%', color:'#212121'}}
           href='https://support.google.com/accounts/answer/41078?hl=en' target='_blank'>
          Change my password
        </a>;
    } else if (user) {
      passwordText =
        <Link to='/resetpassword' style={{color:'#212121', width:'100%', height:'100%'}}>Change my password</Link>;
    }
    return (
      <header className='header'
           style={{flex:'0 0 60px', display:'flex', alignItems:'center',
                   padding:'0px 50px', fontSize:'18px', marginTop:'35px'}}>
        {/* header */}
        <nav style={{display:'flex', alignItems:'center', flex:'0 0 40%'}}>
          <MenuButton to='/' location={location}>Home</MenuButton>
          <MenuButton to='/about' location={location}>About</MenuButton>
          <MenuButton to='/schedule' location={location}>Schedule</MenuButton>
          <MenuButton to='/contact' location={location}>Contact</MenuButton>
        </nav>
        <div style={{flex:'0 0 20%', textAlign:'center'}}>
          <Link to='/'>
            <img src='/images/hbc_40w.png' />
          </Link>
        </div>
        {initialLoadComplete
          ? <nav style={{flex:'0 0 40%', display:'flex', alignItems:'center', justifyContent:'flex-end'}} className='fadein'>
            {!user && <MenuButton to='/login' location={location} >Log In</MenuButton>}
            {user && groups && groups.admin[user.uid] &&
              <MenuButton to='/admin/users' location={location}>Admin</MenuButton>
            }
            {!user && location.pathname !== '/register' &&
              <MenuButton to='/register' location={location} className='registerButton'
                          style={{padding:'16px 30px', borderRadius:'30px', color:'#000'}}>
                Register
              </MenuButton>
            }
            {user &&
              <IconMenu iconButtonElement={<Icon icon='account_circle' className='hoverIcon' style={{fontSize:'24px'}} />}
                        style={{height:'24px'}}
                        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        targetOrigin={{horizontal: 'right', vertical: 'top'}}>
                <MenuItem primaryText={<Link to='/profile' style={{color:'#212121', width:'100%', height:'100%'}}>Manage my profile</Link>} />
                <MenuItem primaryText={passwordText} />
                <Divider />
                <MenuItem primaryText='Sign out' onTouchTap={::actions.logout} />
              </IconMenu>
            }
          </nav>
          : <div style={{flex:'0 0 40%'}} />
        }
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.hbc.user,
    groups: state.hbc.groups,
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