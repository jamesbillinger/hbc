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
import { required, email, playerBirthDate, fullName } from '../validators';
import moment from 'moment';
import find from 'lodash/find';
import Logo from 'components/logo';

class DateText extends Component {
  render() {
    const { input, ageGroups } = this.props;
    const { value } = input || {};
    if (value) {
      let v = moment(value);
      let ageGroup = find(ageGroups, (a) => {
        return v >= a.min && v <= a.max;
      });
      if (ageGroup) {
        return (
          <div style={{marginLeft: '10px', color: '#8BC34A', fontSize: '13px'}}>
            Age Group: {ageGroup.label}
          </div>
        );
      } else {
        return <div />;
      }
    } else {
      return <div />;
    }
  }
}

class PlayerForm extends Component {
  componentWillMount() {
    this._submit = ::this.submit;
    this._close = ::this.close;
  }

  submit(data) {
    const { actions, initialValues, submitAction, closeAction, userID } = this.props;
    if (!data.birthdate) {
      data.birthdate = moment().subtract(7,'years').valueOf();
    }
    return new Promise((resolve, revoke) => {
      if (userID) {
        if (!data.users) {
          data.users = {
            [userID]: true
          };
        } else if (!data.users[userID]) {
          data.users[userID] = true;
        }
      }
      if (initialValues && initialValues.uid) {
        actions.updatePlayer(data, () => {
          resolve();
          this.close(true);
        });
      } else {
        actions.addPlayer(data, () => {
          resolve();
          this.close(true);
        });
      }
    })
  }

  close(data) {
    const { closeAction, history } = this.props;
    if (closeAction) {
      closeAction(data);
    } else {
      history.push('/admin/players');
    }
  }

  render () {
    const { handleSubmit, pristine, submitting, valid, closeAction, hbc, initialValues,
      title, titleStyle } = this.props;
    return (
      <form onSubmit={handleSubmit(this._submit)}
            style={{display:'flex', justifyContent:'center'}}>
        <div>
          {title &&
            <div style={{display:'flex', justifyContent:'center'}}>
              <div style={Object.assign({height:'40px', width:'100%', maxWidth:'600px', display:'flex', flexDirection:'column'}, titleStyle)}>
                <Logo text={title} />
              </div>
            </div>
          }
          <div className='content'>
            <Field component={FormInput} name='name' label='Name' validate={[required, fullName]} autoFocus={true} />
            <Field component={FormDate} name='birthdate' label='Birth Date' validate={[playerBirthDate(hbc.ageGroupMin, hbc.ageGroupMax)]}
                   container='inline' defaultDate={moment().subtract(7,'years')._d}
                   minDate={hbc.ageGroupMin._d} maxDate={hbc.ageGroupMax._d} />
            <Field component={DateText} name='birthdate' ageGroups={hbc.ageGroups} />
          </div>
          <div style={{display:'flex', justifyContent:'center', marginTop:'30px', animationDelay:'0.7s'}} className='content'>
            <Button onClick={handleSubmit(this._submit)} disabled={pristine || submitting || !valid} primary={true} type='submit'>
              Save
            </Button>
            <Button onClick={this._close} disabled={submitting} secondary={true}>
              Cancel
            </Button>
          </div>
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