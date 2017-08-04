import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Column, Table } from 'react-virtualized';
import Icon from 'components/icon';
import Toggle from 'material-ui/Toggle';
import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';

class Users extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentWillMount() {
    this._rowClassName = ::this.rowClassName;
  }

  componentDidMount() {
    const { hbc } = this.props;
    if (hbc.users) {
      this.setState({
        users: orderBy(Object.keys(hbc.users || {}).map((k) => hbc.users[k]), (u) => (
          (u.name && u.name.indexOf(' ') > -1) ? u.name.split(' ')[1] : u.email
        ), 'asc')
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { hbc } = this.props;
    if ((hbc.users && !prevProps.hbc.users) || !isEqual(hbc.users, prevProps.hbc.users)) {
      this.setState({
        users: orderBy(Object.keys(hbc.users || {}).map((k) => hbc.users[k]), (u) => (
          (u.name && u.name.indexOf(' ') > -1) ? u.name.split(' ')[1] : u.email
        ), 'asc')
      });
    }
  }

  rowClassName ({ index }) {
    if (index < 0) {
      return 'headerRow';
    } else {
      return index % 2 === 0 ? 'evenRow' : 'oddRow';
    }
  }

  userClick({ index, rowData, event }) {
    const { history } = this.props;
    if (!(event.target && event.target.id === 'clickable')
      && !(event.target && event.target.parentElement && event.target.parentElement.id === 'clickable')
      && !(event.target && event.target.parentElement && event.target.parentElement.parentElement && event.target.parentElement.parentElement.id === 'clickable')) {
      history.push('/admin/user/' + rowData.uid);
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

  adminRenderer({cellData, rowData}) {
    const { actions, hbc } = this.props;
    return (
      <Toggle id='clickable' toggled={!!(hbc.groups && hbc.groups.admin && hbc.groups.admin[cellData])}
              onToggle={(e, isInputChecked) => {
                if (confirm('Are you sure that you wish to change the Admin status for this user?')) {
                  actions.setUserGroup(rowData.uid, 'admin', isInputChecked, hbc.groups);
                }
              }} />
    );
  }

  verifiedRenderer({cellData, rowData}) {
    const { actions, hbc } = this.props;
    return (
      <Toggle id='clickable' toggled={!!cellData}
              onToggle={(e, isInputChecked) => {
                actions.updateFirebaseUser(rowData.uid, {
                  emailVerified: isInputChecked
                }, (userRecord, err) => {
                  if (err) {
                    console.log(err);
                  } else {
                    actions.updateUser({
                      uid: rowData.uid,
                      emailVerified: userRecord.emailVerified
                    });
                  }
                });
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

  sort({sortBy, sortDirection}) {
    const { hbc } = this.props;
    //_.fromPairs(_.sortBy(_.toPairs(o), function(a){return a[1]}).reverse())
  }

  render() {
    const { hbc, width, height } = this.props;
    const { users } = this.state;
    return (
      <Table width={width} height={height} headerHeight={20} rowHeight={30} rowCount={(users || []).length}
             rowGetter={({ index }) => users[index]} rowStyle={{cursor:'pointer'}}
             rowClassName={this._rowClassName} headerClassName='headerColumn' onRowClick={::this.userClick}>
        <Column label='' dataKey='uid' width={30} flexGrow={0}
                cellRenderer={this.deleteRenderer.bind(this, 'User')} />
        <Column label='Name' dataKey='name' width={100} flexGrow={1}/>
        <Column width={200} label='Email' dataKey='email' flexGrow={1} />
        <Column width={100} label='Phone' dataKey='phone' flexGrow={1} />
        <Column width={80} label='Verified' dataKey='emailVerified' flexGrow={0} cellRenderer={::this.verifiedRenderer} />
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