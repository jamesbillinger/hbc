/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Field, reduxForm } from 'redux-form';
import FormInput from 'components/formInput';
import FormSelect from 'components/formSelect';
import FormDate from 'components/formDate';
import Button from 'components/button';
//import { auth } from 'src/auth';
import { required, email } from '../validators';
import moment from 'moment';


class PlayerForm extends Component {
  componentWillMount() {
    this._submit = ::this.submit;
  }

  submit(data) {
    const { actions, initialValues, submitAction, closeAction } = this.props;
    return new Promise((resolve, revoke) => {
      if (submitAction) {
        submitAction(data);
        resolve();
      } else if (initialValues) {
        actions.updatePlayer(data, () => {
          resolve();
          closeAction && closeAction();
        });
      } else {
        actions.addPlayer(data, () => {
          resolve();
          closeAction && closeAction();
        });
      }
    })
  }

  render () {
    const { handleSubmit, pristine, submitting, valid, closeAction, hbc, initialValues } = this.props;
    return (
      <form onSubmit={handleSubmit(this._submit)} style={{width:'100%'}}>
        <div>
          <Field component={FormInput} name='name' label='Name' validate={[required]} autoFocus={true} />
          <Field component={FormDate} name='birthdate' label='Birth Date' validate={[]} container='inline'
                 defaultDate={moment().subtract(7,'years')._d} />
        </div>
        <div style={{display:'flex', justifyContent:'center', marginTop:'30px'}}>
          <Button onClick={handleSubmit(this._submit)} disabled={pristine || submitting || !valid} primary={true} type='submit'>
            Save
          </Button>
          <Button onClick={closeAction} disabled={submitting} secondary={true}>
            Cancel
          </Button>
        </div>
      </form>
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

export default reduxForm({
  // a unique name for the form
  form: 'PlayerForm'
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerForm))