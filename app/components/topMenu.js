/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { CSSTransitionGroup } from 'react-transition-group'
import MenuButton from 'components/menuButton';

export default class Main extends Component {
  render() {
    const { loggedIn, location } = this.props;
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
          <MenuButton to='/login' location={location} >Log In</MenuButton>
          {location.pathname !== '/register' &&
            <MenuButton to='/register' location={location}
                        style={{padding:'16px 30px', border:'1px solid rgba(0,0,0,0.1)', borderRadius:'30px', color:'#000'}}>
              Register
            </MenuButton>
          }
        </nav>
      </header>
    );
  }
}