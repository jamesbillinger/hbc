import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Column, Table } from 'react-virtualized';
import Icon from 'components/icon';
import moment from 'moment';
import find from 'lodash/find';

class Players extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    this._rowClassName = ::this.rowClassName;
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
    history.push('/admin/player/' + rowData.uid);
  }

  deleteRenderer(type, {cellData, rowData}) {
    const { actions } = this.props;
    return (
      <Icon icon='delete' secondary={true} style={{fontSize:'22px'}} onClick={(e) => {
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

  render() {
    const { hbc, width, height } = this.props;
    return (
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