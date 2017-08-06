/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import moment from 'moment';
import Logo from './logo';
import { Link } from 'react-router-dom';
import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import Icon from 'components/icon';
import AbsoluteWrapper from 'components/absoluteWrapper';

const formatDate = function(start, end) {
  let dt = moment(start);
  if (end) {
    let en = moment(end);
    let ret = '';
    if (en.isSame(start, 'day')) {
      if (dt.isSame(moment(), 'year')) {
        ret += dt.format('ddd MMM D [from] h:mm a');
      } else {
        ret += dt.format('MMM D, YYYY [from] h:mm a');
      }
      ret += ' to ' + en.format('h:mm a');
    } else {
      if (dt.isSame(moment(), 'year')) {
        ret += dt.format('ddd MMM D [at] h:mm a');
      } else {
        ret += dt.format('MMM D, YYYY [at] h:mm a');
      }
      ret += ' to ';
      if (en.isSame(moment(), 'year')) {
        ret += en.format('ddd MMM D [at] h:mm a');
      } else {
        ret += en.format('MMM D, YYYY [at] h:mm a');
      }
    }
    return ret;
  } else {
    if (dt.isSame(moment(), 'year')) {
      return dt.format('ddd MMM D [at] h:mm a');
    } else {
      return dt.format('MMM D, YYYY [at] h:mm a');
    }
  }
};

class Schedule extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { events } = this.props;
    if (events) {
      this.setState({events: orderBy(Object.keys(events || {}).map((k) => events[k]), 'start', 'asc')});
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { events } = this.props;
    if (events && !prevProps.events || !isEqual(events, prevProps.events)) {
      this.setState({events: orderBy(Object.keys(events || {}).map((k) => events[k]), 'start', 'asc')});
    }
  }

  render() {
    const { events } = this.state;
    return (
      <AbsoluteWrapper>
        <div style={{width:'600px', maxWidth:'100%', flex:'1 0 auto'}}>
          <div style={{paddingBottom:'20px', height:'60px', display:'flex', flexDirection:'column', width:'100%'}}>
            <Logo text='Schedule' />
          </div>
          <div>
            {(events || []).map((c, ci) => {
              let summary = c.summary || c.description;
              let more;
              if (summary && summary.length > 150) {
                summary = summary.substring(0,147) + '...';
                more = (
                  <div style={{position:'absolute', bottom:'5px', right:'10px', fontSize:'11px'}}>
                    More...
                  </div>
                );
              }
              return (
                <Link key={c.uid} to={'/schedule/' + c.uid} className='content'
                      style={{display:'flex', marginBottom:'10px', padding: '15px 10px', position:'relative',
                              boxShadow:'0 0 1px rgba(0,0,0,.18), 0 2px 4px rgba(0,0,0,.13)',
                              animationDelay:(0.1 + (ci * 0.1)) + 's'}}>
                  <div style={{padding:'5px 30px 5px 20px', fontSize:'16px', justifyContent:'center', alignItems:'center',
                               display:'flex', flexDirection:'column', color:'#212121'}}>
                    <div style={{fontSize:'20px'}}>{moment(c.start).format('D')}</div>
                    <div>{moment(c.start).format('MMM')}</div>
                  </div>
                  <div style={{display:'flex', flexDirection:'column', justifyContent:'center'}}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                      <div style={{color:'#689F38', fontSize:'15px'}}>{c.name}</div>
                      <div style={{color:'#795548', fontSize:'13px'}}>{c.location}</div>
                    </div>
                    <div style={{color:'#ccc', margin:'5px 0px', display:'flex', alignItems:'center', fontSize:'13px'}}>
                      <div>{formatDate(c.start, c.end)}</div>
                    </div>
                    <div style={{color:'#999', fontSize:'13px'}}>{summary}</div>
                  </div>
                  {more}
                </Link>
              );
            })}
          </div>
        </div>
      </AbsoluteWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    events: state.hbc && state.hbc.events,
    user: state.hbc && state.hbc.user
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
)(Schedule);