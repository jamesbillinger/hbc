import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Column, Table } from 'react-virtualized';
import Icon from 'components/icon';
import moment from 'moment';
import find from 'lodash/find';
import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import FormSelect from 'components/formSelect';
import filter from 'lodash/filter';

class Players extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    this._rowClassName = ::this.rowClassName;
    this._ageGroupChange = ::this.ageGroupChange;
  }

  componentDidMount() {
    const { hbc } = this.props;
    this._ageGroupOptions = [
      {
        value: undefined,
        label: 'All Age Groups'
      },
      ...orderBy(hbc.ageGroups || [], 'sort','asc').map((a) => ({
        value: a.value,
        label: a.label
      }))
    ];
    if (hbc.players) {
      this.setState({
        players: this.loadPlayers()
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { hbc } = this.props;
    if ((hbc.players && !prevProps.hbc.players) || !isEqual(hbc.players, prevProps.hbc.players)) {
      this.setState({
        players: this.loadPlayers()
      });
    }
  }

  loadPlayers(ageGroup) {
    const { hbc } = this.props;
    return filter(
      orderBy(Object.keys(hbc.players || {}).map((k) => hbc.players[k]), [(u) => {
        if (u.birthdate) {
          let v = moment(u.birthdate);
          return (find(hbc.ageGroups, (a) => {
            return v >= a.min && v <= a.max;
          }) || {}).sort;
        } else {
          return -1;
        }
      }, (u) => (
        (u.name && u.name.indexOf(' ') > -1) ? u.name.split(' ')[1] : u.email
      )], ['asc', 'asc']), (u) => {
        if (ageGroup) {
          if (u.birthdate) {
            let v = moment(u.birthdate);
            return (find(hbc.ageGroups, (a) => {
              return v >= a.min && v <= a.max;
            }) || {}).value === ageGroup;
          } else {
            return false;
          }
        } else {
          return true;
        }
      }
    );
  }

  rowClassName ({ index }) {
    if (index < 0) {
      return 'headerRow';
    } else {
      return index % 2 === 0 ? 'evenRow' : 'oddRow';
    }
  }

  playersRenderer({cellData, rowData}) {
    return (
      <div>
        {Object.keys((cellData || {})).length}
      </div>
    );
  }

  playerClick({ index, rowData }) {
    const { history } = this.props;
    if (!(event.target && event.target.id === 'clickable')
      && !(event.target && event.target.parentElement && event.target.parentElement.id === 'clickable')
      && !(event.target && event.target.parentElement && event.target.parentElement.parentElement && event.target.parentElement.parentElement.id === 'clickable')) {
      history.push('/admin/player/' + rowData.uid);
    }
  }

  deleteRenderer(type, {cellData, rowData}) {
    const { actions } = this.props;
    return (
      <Icon id='clickable' icon='delete' secondary={true} style={{fontSize:'22px'}} onClick={(e) => {
        e.preventDefault();
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

  ageGroupChange(val) {
    this.setState({
      ageGroup: val,
      players: this.loadPlayers(val)
    });
  }

  render() {
    const { hbc, width, height } = this.props;
    const { players, ageGroup } = this.state;
    return (
      <div style={{height:height + 'px', width:width + 'px'}}>
        <div style={{height:'50px', display:'flex', alignItems:'center', justifyContent:'flex-end'}}>
          <FormSelect input={{value:ageGroup, onChange:this._ageGroupChange}} options={this._ageGroupOptions} />
        </div>
        <Table width={width} height={height - 50} headerHeight={20} rowHeight={30} rowCount={(players || []).length}
               rowGetter={({ index }) => players[index]} rowStyle={{cursor:'pointer'}}
               rowClassName={this._rowClassName} headerClassName='headerColumn' onRowClick={::this.playerClick}>
          <Column label='' dataKey='uid' width={30} flexGrow={0}
                  cellRenderer={this.deleteRenderer.bind(this, 'Player')} />
          <Column label='' dataKey='uid' width={30} flexGrow={0} cellRenderer={({rowIndex}) => <div>{rowIndex + 1}</div>} />
          <Column label='Name' dataKey='name' width={150} flexGrow={1}/>
          <Column width={100} label='Age Group' dataKey='birthdate' flexGrow={0} cellRenderer={::this.birthDateRenderer} />
          <Column width={100} label='Team' dataKey='uid' flexGrow={1} cellRenderer={::this.playerTeamRenderer} />
          <Column width={150} label='Users' dataKey='users' flexGrow={1} cellRenderer={::this.playerUsersRenderer} />
        </Table>
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
)(Players);