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
  render() {
    const { user } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center'}}>
        <div style={{margin:'4vw'}}>
          <UserForm initialValues={user} />
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
)(Profile);