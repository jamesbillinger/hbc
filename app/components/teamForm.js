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
import Button from 'components/button';
//import { auth } from 'src/auth';
import { required, email } from '../validators';


class TeamForm extends Component {
  componentWillMount() {
    this._submit = ::this.submit;
  }

  submit(data) {
    const { actions, initialValues, closeAction } = this.props;
    return new Promise((resolve, revoke) => {
      if (initialValues) {
        actions.updateTeam(data, () => {
          resolve();
          closeAction && closeAction();
        });
      } else {
        actions.addTeam(data, () => {
          resolve();
          closeAction && closeAction();
        });
      }
    })
  }

  render () {
    const { handleSubmit, pristine, submitting, valid, closeAction, hbc, initialValues } = this.props;
    let coachOptions = Object.keys(hbc.users || {}).map((k) => ({
      value: k,
      label: hbc.users[k].name || k
    }));
    let playersOptions = Object.keys(hbc.players || {}).map((k) => ({
      value: k,
      label: hbc.players[k].name || k
    }));
    return (
      <form onSubmit={handleSubmit(this._submit)} style={{width:'100%'}}>
        <div>
          <Field component={FormInput} name='name' label='Team Name' validate={[required]} />
          <Field component={FormSelect} name='age' label='Age Group' validate={[required]} options={[
            '7u','8u','9u','10u'
          ]} />
          <Field component={FormSelect} name='coaches' label='Coaches' validate={[]} options={coachOptions}
                 multiple={true} />
          <Field component={FormSelect} name='players' label='Players' validate={[]} options={playersOptions}
                 multiple={true} />
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
  form: 'TeamForm'
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamForm))