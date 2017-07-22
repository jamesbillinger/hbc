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
  componentDidMount() {
    const { actions } = this.props;
    //actions.getRecipes();
    /*const { firebaseRef } = this.props;
    const { selectedRecipe } = this.state;
    firebaseRef.child('/recipes/').on('value', (snap) => {
      let recipes = [];
      snap.forEach((child) => {
        recipes.push(Object.assign({}, child.val(), {key: child.key}));
      });
      this.setState({recipes})
    }, (error) => {
      console.log(error);
    });*/
  }

  openRecipe(id) {
    const { history } = this.props;
    if (id) {
      history.push('/recipe/' + id);
    } else {
      history.push('/recipe');
    }
  }

  render() {
    const { history, location, cookbook } = this.props;
    const { recipesData } = cookbook;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center'}}>
        <div style={{width:'1000px', maxWidth:'100%', margin:'4vw',
                     display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'space-around'}}>
          <div style={{flex:'2 1 auto'}} />
          <Logo />
          <div style={{flex:'1 0 auto', color:'rgba(0,0,0,0.4)', fontSize:'30px', display:'flex', alignItems:'center'}}>
            <div style={{}}>Respect. Hard work. Fun.</div>
          </div>
          <div style={{flex:'1 0 auto'}}>
            <MenuButton to='/register' location={location}
                        style={{padding:'16px 50px', border:'none', borderRadius:'30px', color:'white',
                                backgroundColor: '#8BC34A'}}>
              Sign Up
            </MenuButton>
          </div>
          <div style={{flex:'1 1 auto'}} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cookbook: state.cookbook
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