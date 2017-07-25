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
    const { actions } = this.props;
    return (
      <Toggle toggled={!!cellData} onToggle={(e, isInputChecked) => {
        actions.setUserGroup(rowData.uid, 'admin', isInputChecked);
      }}/>
    );
  }

  verifiedRenderer({cellData, rowData}) {
    const { actions } = this.props;
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
        {(cellData || []).join(', ')}
      </div>
    );
  }

  playersRenderer({cellData, rowData}) {
    return (
      <div>
        {(cellData || []).length}
      </div>
    );
  }

  userClick({ index, rowData }) {
    this.setState({
      tab: 3,
      initialValues: rowData
    });
  }

  teamClick({ index, rowData }) {
    this.setState({
      tab: 4,
      initialValues: rowData
    });
  }

  playerClick({ index, rowData }) {
    this.setState({
      tab: 5,
      initialValues: rowData
    });
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

  render() {
    const { hbc } = this.props;
    const { tab, initialValues } = this.state;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', flexDirection:'column', alignItems:'center'}}>
        <div style={{flex:'0 0 auto', width:'100%', display:'flex', justifyContent:'center', backgroundColor:'#DCEDC8'}}>
          <div style={{display:'flex', maxWidth:'800px', width:'100%', alignItems:'center', margin:'0px 50px',
                       justifyContent:'space-between'}}>
            <div style={{display:'flex'}}>
              <div className={'tabButton' + (tab === 0 ? ' active' : '')}
                   style={{borderRight:'1px solid #efefef'}} onClick={this.changeTab.bind(this, 0)}>
                Users
              </div>
              <div className={'tabButton' + (tab === 1 ? ' active' : '')}
                   style={{borderRight:'1px solid #efefef'}} onClick={this.changeTab.bind(this, 1)}>
                Teams
              </div>
              <div className={'tabButton' + (tab === 2 ? ' active' : '')} onClick={this.changeTab.bind(this, 2)}>
                Players
              </div>
            </div>
            <div>
              {tab === 0 &&
                <div className='tabButton' onClick={this.changeTab.bind(this, 3)}>
                  Add New User
                </div>
              }
              {tab === 1 &&
              <div className='tabButton' onClick={this.changeTab.bind(this, 4)}>
                Add New Team
              </div>
              }
              {tab === 2 &&
                <div className='tabButton' onClick={this.changeTab.bind(this, 5)}>
                  Add New Player
                </div>
              }
            </div>
          </div>
        </div>
        <div style={{flex:'1 1 auto', width:'100%', maxWidth:'800px', paddingTop:'20px'}}>
          <AutoSizer>
            {({height, width}) => {
              if (tab === 0) {
                return (
                  <Table width={width} height={height} headerHeight={20} rowHeight={30} rowCount={Object.keys(hbc.users || {}).length}
                         rowGetter={({ index }) => hbc.users[Object.keys(hbc.users)[index]]}
                         rowClassName={this._rowClassName} headerClassName='headerColumn' onRowClick={::this.userClick}>
                    <Column label='' dataKey='uid' width={30} flexGrow={0}
                            cellRenderer={this.deleteRenderer.bind(this, 'User')} />
                    <Column label='Name' dataKey='name' width={100} flexGrow={1}/>
                    <Column width={200} label='Email' dataKey='email' flexGrow={1} />
                    <Column width={80} label='Verified' dataKey='emailVerified' flexGrow={0} cellRenderer={::this.verifiedRenderer} />
                    <Column width={80} label='Admin' dataKey='admin' flexGrow={0} cellRenderer={::this.adminRenderer}/>
                  </Table>
                );
              } else if (tab === 1) {
                return (
                  <Table width={width} height={height} headerHeight={20} rowHeight={30} rowCount={Object.keys(hbc.teams || {}).length}
                         rowGetter={({ index }) => hbc.teams[Object.keys(hbc.teams)[index]]}
                         rowClassName={this._rowClassName} headerClassName='headerColumn' onRowClick={::this.teamClick}>
                    <Column label='' dataKey='uid' width={30} flexGrow={0}
                            cellRenderer={this.deleteRenderer.bind(this, 'Team')} />
                    <Column label='Name' dataKey='name' width={100} flexGrow={1}/>
                    <Column width={80} label='Age' dataKey='age' flexGrow={0} />
                    <Column width={80} label='Coaches' dataKey='coaches' flexGrow={3} cellRenderer={::this.coachesRenderer} />
                    <Column width={80} label='Players' dataKey='players' flexGrow={0} cellRenderer={::this.playersRenderer} />
                  </Table>
                );
              } else if (tab === 2) {
                return (
                  <Table width={width} height={height} headerHeight={20} rowHeight={30} rowCount={Object.keys(hbc.players || {}).length}
                         rowGetter={({ index }) => hbc.players[Object.keys(hbc.players)[index]]}
                         rowClassName={this._rowClassName} headerClassName='headerColumn' onRowClick={::this.playerClick}>
                    <Column label='' dataKey='uid' width={30} flexGrow={0}
                            cellRenderer={this.deleteRenderer.bind(this, 'Player')} />
                    <Column label='Name' dataKey='name' width={100} flexGrow={1}/>
                    <Column width={200} label='Email' dataKey='email' flexGrow={1} />
                    <Column width={80} label='Verified' dataKey='emailVerified' flexGrow={0} cellRenderer={::this.verifiedRenderer} />
                    <Column width={80} label='Admin' dataKey='admin' flexGrow={0} cellRenderer={::this.adminRenderer}/>
                  </Table>
                );
              } else if (tab === 3) {
                return (
                  <div style={{width: width + 'px'}}>
                    <UserForm closeAction={this.changeTab.bind(this, 0)} initialValues={initialValues} />
                  </div>
                );
              } else if (tab === 4) {
                return (
                  <div style={{width: width + 'px'}}>
                    <TeamForm closeAction={this.changeTab.bind(this, 1)} initialValues={initialValues} />
                  </div>
                );
              } else if (tab === 5) {
                return (
                  <div style={{width: width + 'px'}}>
                    <PlayerForm closeAction={this.changeTab.bind(this, 1)} initialValues={initialValues} />
                  </div>
                );
              }
            }}
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