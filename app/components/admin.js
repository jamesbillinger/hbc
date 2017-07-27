import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { AutoSizer } from 'react-virtualized';
import TeamForm from 'components/teamForm';
import UserForm from 'components/userForm';
import PlayerForm from 'components/playerForm';
import FAQForm from 'components/faqForm';
import { Route, Switch, Link } from 'react-router-dom';
import Users from 'components/users';
import Players from 'components/players';
import Teams from 'components/teams';
import FAQs from 'components/faqs';

class Admin extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { actions, hbc } = this.props;
    if (!hbc.users) {
      actions.fetchUsers();
    }
    if (!hbc.teams) {
      actions.fetchTeams();
    }
    if (!hbc.players) {
      actions.fetchPlayers();
    }
  }

  render() {
    const { hbc, location } = this.props;
    const { tab, initialValues } = this.state;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', flexDirection:'column', alignItems:'center'}}>
        <div style={{flex:'0 0 auto', width:'100%', display:'flex', justifyContent:'center', backgroundColor:'#DCEDC8'}}>
          <div style={{display:'flex', maxWidth:'800px', width:'100%', alignItems:'center', margin:'0px 50px',
                       justifyContent:'space-between'}}>
            <div style={{display:'flex'}}>
              <Link className={'tabButton' + (location.pathname === '/admin/users' ? ' active' : '')}
                    style={{borderRight:'1px solid #efefef'}} to='/admin/users'>
                Users
              </Link>
              <Link className={'tabButton' + (location.pathname === '/admin/teams' ? ' active' : '')}
                    style={{borderRight:'1px solid #efefef'}} to='/admin/teams'>
                Teams
              </Link>
              <Link className={'tabButton' + (location.pathname === '/admin/players' ? ' active' : '')}
                    to='/admin/players'>
                Players
              </Link>
              <Link className={'tabButton' + (location.pathname === '/admin/faqs' ? ' active' : '')}
                    to='/admin/faqs'>
                FAQs
              </Link>
            </div>
            <div>
              <Route path='/admin/users' exact={true} render={(props) =>
                <Link className='tabButton' to='/admin/user'>
                  Add New User
                </Link>
              } />
              <Route path='/admin/teams' exact={true} render={(props) =>
                <Link className='tabButton' to='/admin/team'>
                  Add New Team
                </Link>
              } />
              <Route path='/admin/players' exact={true} render={(props) =>
                <Link className='tabButton' to='/admin/player'>
                  Add New Player
                </Link>
              } />
              <Route path='/admin/faqs' exact={true} render={(props) =>
                <Link className='tabButton' to='/admin/faq'>
                  Add New FAQ
                </Link>
              } />
            </div>
          </div>
        </div>
        <div style={{flex:'1 1 auto', width:'100%', maxWidth:'800px', paddingTop:'20px'}}>
          <AutoSizer>
            {({height, width}) =>
              <Route location={location} key={location.key}>
                <Switch>
                  <Route path='/admin/users' exact={true} render={(props) =>
                    <Users width={width} height={height} {...props} />
                  } />
                  <Route path='/admin/user/:uid?' render={(props) =>
                    <div style={{width: width + 'px'}}>
                      {hbc.users &&
                        <UserForm initialValues={hbc.users[props.match.params.uid]}
                                  title={props.match.params.uid ? 'Edit User' : 'Add New User'}
                                  titleStyle={{width:'280px', paddingBottom:'20px'}}
                                  form={'UserForm_' + (props.match.params ? props.match.params.uid : 'new')} {...props} />
                      }
                    </div>
                  } />
                  <Route path='/admin/teams' exact={true} render={(props) =>
                    <Teams width={width} height={height} {...props} />
                  } />
                  <Route path='/admin/team/:uid?' render={(props) =>
                    <div style={{width: width + 'px'}}>
                      {hbc.teams &&
                        <TeamForm initialValues={hbc.teams[props.match.params.uid]}
                                  title={props.match.params.uid ? 'Edit Team' : 'Add New Team'}
                                  titleStyle={{width:'280px', paddingBottom:'20px'}}
                                  form={'TeamForm_' + (props.match.params ? props.match.params.uid : 'new')} {...props} />
                      }
                    </div>
                  } />
                  <Route path='/admin/players' exact={true} render={(props) =>
                    <Players width={width} height={height} {...props} />
                  } />
                  <Route path='/admin/player/:uid?' render={(props) =>
                    <div style={{width: width + 'px'}}>
                      {hbc.players &&
                        <PlayerForm initialValues={hbc.players[props.match.params.uid]}
                                    title={props.match.params.uid ? 'Edit Player' : 'Add New Player'}
                                    titleStyle={{width:'280px', paddingBottom:'20px'}}
                                    form={'PlayerForm_' + (props.match.params ? props.match.params.uid : 'new')} {...props} />
                      }
                    </div>
                  } />
                  <Route path='/admin/faqs' exact={true} render={(props) =>
                    <FAQs width={width} height={height} {...props} />
                  } />
                  <Route path='/admin/faq/:uid?' render={(props) =>
                    <div style={{width: width + 'px'}}>
                      {hbc.faqs &&
                        <FAQForm initialValues={hbc.faqs[props.match.params.uid]}
                                 title={props.match.params.uid ? 'Edit FAQ' : 'Add New FAQ'}
                                 titleStyle={{width:'280px', paddingBottom:'20px'}}
                                 form={'FAQForm_' + (props.match.params ? props.match.params.uid : 'new')} {...props} />
                      }
                    </div>
                  } />
                </Switch>
              </Route>
            }
          </AutoSizer>
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
)(Admin);