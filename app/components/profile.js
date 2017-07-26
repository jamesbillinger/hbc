import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import FormInput from './formInput';
import UserForm from './userForm';

class LabelledText extends Component {
  render() {
    const { label, value } = this.props;
    return (
      <div style={{marginTop:'10px'}}>
        <div style={{fontSize:'0.9em', color:'#bbb'}}>{label}</div>
        <div>{value}</div>
      </div>
    )
  }
}

class Profile extends Component {
  componentDidMount() {
    const { hbc, actions } = this.props;
    if (!hbc.players) {
      actions.fetchPlayers();
    }
  }
  render() {
    const { hbc, history } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center'}}>
        <div style={{margin:'4vw', width:'100%'}}>
          <UserForm initialValues={hbc.user} title='My Profile' form={'UserForm_' + hbc.user.uid} history={history} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    hbc: state.hbc
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
)(Profile);