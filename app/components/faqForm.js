/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Field, reduxForm } from 'redux-form';
import FormInput from 'components/formInput';
import Button from 'components/button';
import { required } from '../validators';
import Logo from 'components/logo';


class FAQForm extends Component {
  componentWillMount() {
    this._submit = ::this.submit;
    this._close = ::this.close;
  }

  submit(data) {
    const { actions, initialValues, closeAction } = this.props;
    return new Promise((resolve, revoke) => {
      if (initialValues) {
        actions.updateFAQ(data, () => {
          resolve();
          this.close();
        });
      } else {
        actions.addFAQ(data, () => {
          resolve();
          this.close();
        });
      }
    })
  }

  close() {
    const { closeAction, history } = this.props;
    if (closeAction) {
      closeAction();
    } else {
      history.push('/admin/faqs');
    }
  }

  render () {
    const { handleSubmit, pristine, submitting, valid, hbc, initialValues, title, titleStyle } = this.props;
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
            <Field component={FormInput} name='question' label='Question' validate={[required]} multiLine={true}
                   style={{width:'50vw', maxWidth:'600px'}} />
            <Field component={FormInput} name='answer' label='Answer' validate={[required]} multiLine={true}
                   style={{width:'50vw', maxWidth:'600px'}} />
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
  form: 'FAQForm'
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(FAQForm))