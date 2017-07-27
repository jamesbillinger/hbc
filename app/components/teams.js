import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Column, Table } from 'react-virtualized';
import Icon from 'components/icon';

class Teams extends Component {
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

  teamClick({ index, rowData }) {
    const { history } = this.props;
    history.push('/admin/team/' + rowData.uid);
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

  coachesRenderer({cellData, rowData}) {
    const { hbc } = this.props;
    return (
      <div>
        {Object.keys(cellData || {}).map((c) => (hbc.users[c] || {}).name).join(', ')}
      </div>
    );
  }

  render() {
    const { hbc, width, height } = this.props;
    return (
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
)(Teams);