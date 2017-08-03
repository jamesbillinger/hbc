/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Link } from 'react-router-dom';
import AbsoluteWrapper from 'components/absoluteWrapper';

class PasswordUpdated extends Component {
  componentDidMount() {
    const { history, hbc } = this.props;
    this._timer = setTimeout(() => {
      history.push(hbc.user ? '/' : '/login');
    }, 8000)
  }

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  render () {
    const { hbc } = this.props;
    return (
      <AbsoluteWrapper>
        <div style={{fontSize:'16px', color:'#bbb'}} className='content'>Your password has been updated</div>
        <div style={{marginTop:'30px'}}>
          {hbc.user
            ? <Link to='/' className='dashboardButton'
                  style={{padding:'16px 32px', border:'none', borderRadius:'30px', color:'white', cursor:'pointer',zIndex:'2'}}>
              Return Home
            </Link>
            : <Link to='/login' className='dashboardButton'
                style={{padding:'16px 32px', border:'none', borderRadius:'30px', color:'white', cursor:'pointer',zIndex:'2'}}>
              Login
            </Link>
          }
        </div>
      </AbsoluteWrapper>
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
)(PasswordUpdated)