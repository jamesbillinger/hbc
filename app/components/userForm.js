import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Field, reduxForm } from 'redux-form';
import FormInput from 'components/formInput';
import Button from 'components/button';
import { required, email, phoneNumber } from '../validators';
import filter from 'lodash/filter';
import map from 'lodash/map';
import PlayerForm from './playerForm';
import Logo from 'components/logo';
import MaskedInput from 'components/maskedInput';
import isEqual from 'lodash/isEqual';
import find from 'lodash/find';
import moment from 'moment';
import Icon from 'components/icon';
import FormToggle from 'components/formToggle';

class UserForm extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    this._submit = ::this.submit;
    this._close = ::this.close;
  }

  componentDidMount() {
    const { hbc, initialValues } = this.props;
    if (initialValues && initialValues.uid) {
      this.setState({
        players: filter(hbc.players || {}, (p) => {
          return (p.users || {})[initialValues.uid];
        })
      });
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { hbc, initialValues } = nextProps;
    if (initialValues && initialValues.uid && !isEqual(hbc.players, this.props.hbc.players)) {
      this.setState({
        players: filter(hbc.players || {}, (p) => {
          return (p.users || {})[initialValues.uid];
        })
      });
    }
  }

  submit(data) {
    const { actions, initialValues, closeAction, history } = this.props;
    const { updatedPlayers, players } = this.state;
    return new Promise((resolve, revoke) => {
      if (initialValues) {
        actions.updateUser(data, () => {
          if (updatedPlayers) {
            Object.keys(players).map((k) => {
              let p = players[k];
              actions.updatePlayer(p);
            })
          }
          resolve();
          this.close();
        });
      } else {
        actions.addUser(data, (uid) => {
          resolve();
          history.push('/admin/user/' + uid);
        });
      }
    })
  }

  close() {
    const { closeAction, history } = this.props;
    if (closeAction) {
      closeAction();
    } else {
      history.push('/admin/users');
    }
  }

  selectPlayer(player) {
    this.setState({player});
  }

  playerClose(updated) {
    this.setState({player: undefined});
  }

  render() {
    const { handleSubmit, pristine, submitting, valid, closeAction, hbc, mode, initialValues, reset,
      title, titleStyle, actions } = this.props;
    const { player, players } = this.state;
    let playerHeading = 'My Players';
    if (player) {
      playerHeading = 'Add Player';
      if (player.uid) {
        playerHeading = 'Edit ' + (player.name && player.name.split(' ')[0]);
      }
    }
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center', paddingTop:'4vh'}}>
        <div>
          {title &&
            <div style={{display:'flex', justifyContent:'center', width:'100%'}}>
              <div style={Object.assign({
                height:'30px', width:'100%', maxWidth:'600px', display:'flex', flexDirection:'column', marginBottom:'10px'
              }, titleStyle)}>
                <Logo text={title} />
              </div>
            </div>
          }
          <div style={{display:'flex'}}>
            <div style={{borderRight:'1px solid #ddd', marginRight:'20px', paddingRight:'15px'}} className='content'>
              <form onSubmit={handleSubmit(this._submit)}>
                <h3>My Contact Info</h3>
                <Field component={FormInput} name='name' label='Name'
                       validate={[required]} disabled={!!player} />
                <Field component={MaskedInput} name='phone' label='Phone' mask='(111) 111-1111'
                       validate={[phoneNumber]} disabled={!!player} />
                <Field component={FormInput} name='email' label='Email Address'
                       validate={[required, email]} disabled={!!player} />
                <Field component={FormToggle} name='willingToCoach' label='Would you like to help coach?'
                       disabled={!!player} />
                {!player &&
                  <div style={{display:'flex', justifyContent:'center', marginTop:'30px'}}>
                    <Button onClick={handleSubmit(this._submit)} disabled={pristine || submitting || !valid} primary={true} type='submit'>
                      Save
                    </Button>
                    <Button onClick={this._close} disabled={submitting} secondary={true}>
                      Cancel
                    </Button>
                  </div>
                }
              </form>
            </div>
            <div style={{flex:'1 1 auto', minWidth:'300px'}} className='content'>
              {initialValues && initialValues.uid && <h3>{playerHeading}</h3>}
              {!player &&
                <div style={{display:'flex', flexDirection:'column', minHeight:'300px', marginTop:'20px'}}>
                  {Object.keys(players || {}).length > 0 &&
                    <div style={{flex: '0 0 auto'}}>
                      {map(players || [], (p, pi) => {
                        let v = moment(p.birthdate);
                        let ageGroup = find(hbc.ageGroups || [], (a) => {
                          return v >= a.min && v <= a.max;
                        });
                        return (
                          <div key={pi} style={{display:'flex'}}>
                            <div className={pi % 2 ? 'evenRow' : 'oddRow'} onClick={this.selectPlayer.bind(this, p)}
                                 style={{padding:'5px 10px', cursor:'pointer', flex:'1 0 auto'}}>
                              <div style={{display:'flex', justifyContent:'space-between'}}>
                                <div>{p.name}</div>
                                <div>{v.format('M/D/YY')}</div>
                              </div>
                              <div style={{fontSize:'12px', color:'#999', paddingTop:'3px'}}>Age Group: {ageGroup && ageGroup.label}</div>
                              {/*<div style={{textAlign:'center', color:'#0D3461', fontSize:'14px'}}>Team</div>*/}
                            </div>
                            <Icon icon='close' secondary={true} style={{fontSize:'22px', flex:'0 0 30px'}} onClick={() => {
                              if (confirm('Are you sure that you want to delete this player?')) {
                                actions.deletePlayer(p.uid);
                              }
                            }} />
                          </div>
                        );
                      })}
                    </div>
                  }
                  <div style={{flex:'1 1 auto'}} />
                  <div style={{flex:'0 0 auto', display:'flex', justifyContent:'center'}}>
                    {initialValues && initialValues.uid &&
                      <div onClick={this.selectPlayer.bind(this, {})} className='dashboardButton'
                           style={{padding:'8px 15px', border:'none', borderRadius:'30px', color:'white', cursor:'pointer'}}>
                        Add Player
                      </div>
                    }
                  </div>
                  <div style={{flex:'1 1 auto'}} />
                </div>
              }
              {player &&
                <PlayerForm initialValues={player} closeAction={::this.playerClose}
                            userID={initialValues && initialValues.uid} />
              }
            </div>
          </div>
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

export default reduxForm({
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserForm))