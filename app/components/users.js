import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Column, Table } from 'react-virtualized';
import Icon from 'components/icon';
import Toggle from 'material-ui/toggle';

class Users extends Component {
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

  userClick({ index, rowData }) {
    const { history } = this.props;
    history.push('/admin/user/' + rowData.uid);
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

  render() {
    const { hbc, width, height } = this.props;
    return (
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
)(Users);