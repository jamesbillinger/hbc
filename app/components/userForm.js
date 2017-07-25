import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Field, reduxForm } from 'redux-form';
import FormInput from 'components/formInput';
import Button from 'components/button';
import { required, email } from '../validators';
import filter from 'lodash/filter';
import map from 'lodash/map';
import PlayerForm from './playerForm';

class UserForm extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    this._submit = ::this.submit;
  }

  componentDidMount() {
    const { hbc, initialValues } = this.props;
    this.setState({
      players: filter(hbc.players || {}, (p) => {
        return (p.users || []).indexOf(initialValues.uid) > -1;
      })
    });
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
        actions.addUser(data, () => {
          resolve();
          closeAction && closeAction();
        });
      }
    })
  }

  selectPlayer(player) {
    this.setState({player});
  }

  playerClose(player) {
    this.setState({
      players: player ? Object.assign({}, this.state.players, {
        [player.uid]: player
      }) : this.state.players,
      player:undefined
    });
  }

  render() {
    const { handleSubmit, pristine, submitting, valid, closeAction, hbc, mode, initialValues } = this.props;
    const { player, players } = this.state;
    let playerHeading = 'Your Players';
    if (player) {
      playerHeading = 'Add Player';
      if (player.uid) {
        playerHeading = 'Edit ' + player.name;
      }
    }
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center', paddingTop:'4vh'}}>
        <div>
          <div style={{display:'flex'}}>
            <div style={{borderRight:'1px solid #ddd', marginRight:'20px', paddingRight:'15px'}}>
              <form onSubmit={handleSubmit(this._submit)}>
                <h4>Your Profile</h4>
                <Field component={FormInput} name='name' label='Name'
                       validate={[required]} disabled={!!player} />
                <Field component={FormInput} name='phone' label='Phone'
                       validate={[]} disabled={!!player} />
                <Field component={FormInput} name='email' label='Email Address'
                       validate={[required, email]} disabled={!!player} />
              </form>
            </div>
            <div style={{flex:'1 1 auto', minWidth:'300px'}}>
              <h4>{playerHeading}</h4>
              {!player &&
                <div>
                  {map(players || [], (p, pi) =>
                    <div key={pi}>
                      <div style={{display:'flex', justifyContent:'space-between'}}>
                        <div>{p.name}</div>
                        <div>{p.birthdate}</div>
                      </div>
                      <div style={{fontSize:'12px', color:'#999'}}>Age Group: </div>
                      <div style={{textAlign:'center', color:'#0D3461', fontSize:'14px'}}>Team</div>
                    </div>
                  )}
                  <div style={{display:'flex', justifyContent:'center', marginTop:'15px'}}>
                    <div onClick={this.selectPlayer.bind(this, {})} className='dashboardButton'
                         style={{padding:'8px 15px', border:'none', borderRadius:'30px', color:'white', cursor:'pointer'}}>
                      Add Player
                    </div>
                  </div>
                </div>
              }
              {player &&
                <PlayerForm initialValues={player} submitAction={::this.playerClose} closeAction={::this.playerClose} />
              }
            </div>
          </div>
          {!player &&
            <div style={{display:'flex', justifyContent:'center', marginTop:'30px'}}>
              <Button onClick={handleSubmit(this._submit)} disabled={pristine || submitting || !valid} primary={true} type='submit'>
                Save
              </Button>
              <Button onClick={closeAction} disabled={submitting} secondary={true}>
                Cancel
              </Button>
            </div>
          }
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
  // a unique name for the form
  form: 'UserForm'
})(connect(
  mapStateToProps,
  mapDispatchToProps
)(UserForm))