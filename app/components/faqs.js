import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Column, Table } from 'react-virtualized';
import Icon from 'components/icon';
import moment from 'moment';
import find from 'lodash/find';

class FAQs extends Component {
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

  faqClick({ index, rowData }) {
    const { history } = this.props;
    if (!(event.target && event.target.id === 'clickable')
      && !(event.target && event.target.parentElement && event.target.parentElement.id === 'clickable')
      && !(event.target && event.target.parentElement && event.target.parentElement.parentElement && event.target.parentElement.parentElement.id === 'clickable')) {
      history.push('/admin/faq/' + rowData.uid);
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

  render() {
    const { hbc, width, height } = this.props;
    return (
      <Table width={width} height={height} headerHeight={20} rowHeight={30} rowCount={Object.keys(hbc.faqs || {}).length}
             rowGetter={({ index }) => hbc.faqs[Object.keys(hbc.faqs)[index]]} rowStyle={{cursor:'pointer'}}
             rowClassName={this._rowClassName} headerClassName='headerColumn' onRowClick={::this.faqClick}>
        <Column label='' dataKey='uid' width={30} flexGrow={0}
                cellRenderer={this.deleteRenderer.bind(this, 'FAQ')} />
        <Column label='Question' dataKey='question' width={100} flexGrow={1}
                style={{whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipses'}} />
        <Column label='Answer' dataKey='answer' width={150} flexGrow={1}
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
)(FAQs);