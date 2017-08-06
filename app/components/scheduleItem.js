/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import moment from 'moment';
import { Link } from 'react-router-dom';
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
      ret += 'From ';
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

class ScheduleItem extends Component {
  render() {
    const { events, match } = this.props;
    let event;
    if (events && match.params && match.params.uid) {
      event = events[match.params.uid];
    }
    return (
      <AbsoluteWrapper>
        <div style={{width:'600px', maxWidth:'100%', flex:'1 0 auto'}}>
          <div style={{padding:'4vw', borderRadius:'6px', boxShadow:'0 0 1px rgba(0,0,0,.18), 0 2px 4px rgba(0,0,0,.13)',
                       marginTop:'20px'}}>
            <Link to='/schedule' style={{color:'#795548', fontSize:'13px'}} className='content'>
              &larr; Back go schedule
            </Link>
            <div style={{animationDelay:'0.7s'}} className='content'>
              {event &&
                <div>
                  <div style={{fontSize:'18px', marginTop:'20px', color:'#689F38'}}>
                    {event.name}
                  </div>
                  <div style={{marginTop:'8px', color:'#8BC34A', fontSize:'14px'}}>
                    {event.location}
                  </div>
                  <div style={{marginTop:'8px', color:'#ccc', fontSize:'13px'}}>
                    {formatDate(event.start, event.end)}
                  </div>
                  <div style={{marginTop:'20px', whiteSpace:'pre-wrap'}}>
                    {event.description || event.summary}
                  </div>
                </div>
              }
            </div>
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
)(ScheduleItem);