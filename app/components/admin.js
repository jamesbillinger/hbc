import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';

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
  }

  render() {
    const { hbc } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center'}}>
        Admin
        <div>
          {Object.keys(hbc.users || {}).map((k) => {
            let u = hbc.users[k];
            return (
              <div key={k} style={{display: 'flex'}}>
                {u.name}
              </div>
            );
          })}
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