import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Column, Table } from 'react-virtualized';
import Icon from 'components/icon';
import moment from 'moment';
import find from 'lodash/find';

class Events extends Component {
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

  eventClick({ index, rowData }) {
    const { history } = this.props;
    if (!(event.target && event.target.id === 'clickable')
      && !(event.target && event.target.parentElement && event.target.parentElement.id === 'clickable')
      && !(event.target && event.target.parentElement && event.target.parentElement.parentElement && event.target.parentElement.parentElement.id === 'clickable')) {
      history.push('/admin/event/' + rowData.uid);
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

  dateRenderer({cellData, rowData}) {
    return <div>{moment(cellData).format('M/D/YY h:mm a')}</div>;
  }

  render() {
    const { hbc, width, height } = this.props;
    return (
      <Table width={width} height={height} headerHeight={20} rowHeight={30} rowCount={Object.keys(hbc.events || {}).length}
             rowGetter={({ index }) => hbc.events[Object.keys(hbc.events)[index]]} rowStyle={{cursor:'pointer'}}
             rowClassName={this._rowClassName} headerClassName='headerColumn' onRowClick={::this.eventClick}>
        <Column label='' dataKey='uid' width={30} flexGrow={0}
                cellRenderer={this.deleteRenderer.bind(this, 'Event')} />
        <Column label='Start' dataKey='start' width={100} flexGrow={1} cellRenderer={::this.dateRenderer} />
        <Column label='End' dataKey='end' width={100} flexGrow={1} cellRenderer={::this.dateRenderer} />
        <Column label='Location' dataKey='location' width={100} flexGrow={1} />
        <Column label='Event Name' dataKey='name' width={150} flexGrow={1} />
        <Column label='Summary' dataKey='summary' width={150} flexGrow={1}
                style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipses'}} />
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
)(Events);