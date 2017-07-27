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
        {initialLoadComplete &&
          <nav style={{display:'flex', alignItems:'center'}} className='fadein'>
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
                <MenuItem primaryText={<Link to='/profile' style={{color:'black'}}>Manage my profile</Link>} />
                <Divider />
                <MenuItem primaryText='Sign out' onTouchTap={::actions.logout} />
              </IconMenu>
            }
          </nav>
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