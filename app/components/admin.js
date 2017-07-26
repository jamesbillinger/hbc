import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Column, Table, AutoSizer } from 'react-virtualized';
import Toggle from 'material-ui/toggle';
import TeamForm from './teamForm';
import UserForm from './userForm';
import PlayerForm from './playerForm';
import Icon from 'components/icon';
import { Route, Switch, Link } from 'react-router-dom';
import moment from 'moment';
import find from 'lodash/find';
import filter from 'lodash/filter';
import map from 'lodash/map';

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      tab: 0
    };
  }

  componentWillMount() {
    this._rowClassName = ::this.rowClassName;
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

  changeTab(tab) {
    if (tab !== this.state.tab) {
      this.setState({
        tab,
        initialValues: undefined
      })
    }
  }

  rowClassName ({ index }) {
    if (index < 0) {
      return 'headerRow';
    } else {
      return index % 2 === 0 ? 'evenRow' : 'oddRow';
    }
  }

  adminRenderer({cellData, rowData}) {
    const { actions, hbc } = this.props;
    return (
      <Toggle toggled={!!(hbc.groups && hbc.groups.admin && hbc.groups.admin[cellData])}
              onToggle={(e, isInputChecked) => {
                actions.setUserGroup(rowData.uid, 'admin', isInputChecked);
              }} />
    );
  }

  toggleRenderer({cellData, rowData}) {
    return (
      <Toggle toggled={!!cellData} />
    );
    /*
    onToggle={(e, isInputChecked) => {
        if (confirm('Would you like to re-send the verification email to this user?')) {
          console.log('yes');
          alert('Email sent');
        }
      }}
     */
  }

  coachesRenderer({cellData, rowData}) {
    const { hbc } = this.props;
    return (
      <div>
        {Object.keys(cellData || {}).map((c) => (hbc.users[c] || {}).name).join(', ')}
      </div>
    );
  }

  playersRenderer({cellData, rowData}) {
    return (
      <div>
        {Object.keys((cellData || {})).length}
      </div>
    );
  }

  userClick({ index, rowData }) {
    const { history } = this.props;
    history.push('/admin/user/' + rowData.uid);
  }

  teamClick({ index, rowData }) {
    const { history } = this.props;
    history.push('/admin/team/' + rowData.uid);
  }

  playerClick({ index, rowData }) {
    const { history } = this.props;
    history.push('/admin/player/' + rowData.uid);
  }

  deleteRenderer(type, {cellData, rowData}) {
    const { actions } = this.props;
    return (
      <Icon icon='delete' secondary={true} style={{fontSize:'22px'}} onClick={() => {
        if (confirm('Are you sure that you want to delete this ' + type + '?')) {
          actions['delete' + type](cellData);
        }
      }} />
    );
  }

  birthDateRenderer({cellData, rowData}) {
    const { hbc } = this.props;
    if (cellData) {
      let v = moment(cellData);
      let ageGroup = find(hbc.ageGroups, (a) => {
        return v >= a.min && v <= a.max;
      });
      return <div>{ageGroup && ageGroup.label}</div>;
    } else {
      return <div />;
    }
  }

  playerTeamRenderer({cellData, rowData}) {
    const { hbc } = this.props;
    if (cellData) {
      let team = find(hbc.teams || {}, (t) => {
        return t.players && t.players[cellData]
      });
      return <div>{team && team.name}</div>;
    } else {
      return <div />;
    }
  }

  playerUsersRenderer({cellData, rowData}) {
    const { hbc } = this.props;
    return (
      <div>
        {Object.keys(cellData || {}).map((k) => (hbc.users[k] || {}).name).join(', ')}
      </div>
    );
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
            </div>
          </div>
        </div>
        <div style={{flex:'1 1 auto', width:'100%', maxWidth:'800px', paddingTop:'20px'}}>
          <AutoSizer>
            {({height, width}) =>
              <Route location={location} key={location.key}>
                <Switch>
                  <Route path='/admin/users' exact={true} render={(props) =>
                    <Table width={width} height={height} headerHeight={20} rowHeight={30} rowCount={Object.keys(hbc.users || {}).length}
                           rowGetter={({ index }) => hbc.users[Object.keys(hbc.users)[index]]} rowStyle={{cursor:'pointer'}}
                           rowClassName={this._rowClassName} headerClassName='headerColumn' onRowClick={::this.userClick}>
                      <Column label='' dataKey='uid' width={30} flexGrow={0}
                              cellRenderer={this.deleteRenderer.bind(this, 'User')} />
                      <Column label='Name' dataKey='name' width={100} flexGrow={1}/>
                      <Column width={200} label='Email' dataKey='email' flexGrow={1} />
                      <Column width={100} label='Phone' dataKey='phone' flexGrow={1} />
                      <Column width={80} label='Verified' dataKey='emailVerified' flexGrow={0} cellRenderer={::this.toggleRenderer} />
                      <Column width={80} label='Admin' dataKey='uid' flexGrow={0} cellRenderer={::this.adminRenderer}/>
                      <Column width={80} label='+ Coach' dataKey='willingToCoach' flexGrow={0} cellRenderer={::this.toggleRenderer} />
                    </Table>
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
                    <Table width={width} height={height} headerHeight={20} rowHeight={30} rowCount={Object.keys(hbc.teams || {}).length}
                           rowGetter={({ index }) => hbc.teams[Object.keys(hbc.teams)[index]]} rowStyle={{cursor:'pointer'}}
                           rowClassName={this._rowClassName} headerClassName='headerColumn' onRowClick={::this.teamClick}>
                      <Column label='' dataKey='uid' width={30} flexGrow={0}
                              cellRenderer={this.deleteRenderer.bind(this, 'Team')} />
                      <Column label='Name' dataKey='name' width={100} flexGrow={1}/>
                      <Column width={80} label='Age' dataKey='ageGroup' flexGrow={0} />
                      <Column width={80} label='Coaches' dataKey='coaches' flexGrow={3} cellRenderer={::this.coachesRenderer} />
                      <Column width={80} label='Players' dataKey='players' flexGrow={0} cellRenderer={::this.playersRenderer} />
                    </Table>
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
                    <Table width={width} height={height} headerHeight={20} rowHeight={30} rowCount={Object.keys(hbc.players || {}).length}
                           rowGetter={({ index }) => hbc.players[Object.keys(hbc.players)[index]]} rowStyle={{cursor:'pointer'}}
                           rowClassName={this._rowClassName} headerClassName='headerColumn' onRowClick={::this.playerClick}>
                      <Column label='' dataKey='uid' width={30} flexGrow={0}
                              cellRenderer={this.deleteRenderer.bind(this, 'Player')} />
                      <Column label='Name' dataKey='name' width={150} flexGrow={1}/>
                      <Column width={100} label='Age Group' dataKey='birthdate' flexGrow={0} cellRenderer={::this.birthDateRenderer} />
                      <Column width={100} label='Team' dataKey='uid' flexGrow={1} cellRenderer={::this.playerTeamRenderer} />
                      <Column width={150} label='Users' dataKey='users' flexGrow={1} cellRenderer={::this.playerUsersRenderer} />
                    </Table>
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