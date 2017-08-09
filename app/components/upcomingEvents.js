/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Icon from 'components/icon';
import orderBy from 'lodash/orderBy';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const { events } = this.props;
    if (events) {
      this.setState({
        events: filter(
          orderBy(
            Object.keys(events || {}).map((k) =>
              events[k]
            ), 'start', 'asc'
          ), (e) => {
            if (e.end) {
              return moment(e.end).clone().endOf('day') >= moment();
            } else {
              return moment(e.start).clone().endOf('day') >= moment();
            }
          })
          .slice(0, 4)
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { events } = this.props;
    if (events && !prevProps.events || !isEqual(events, prevProps.events)) {
      this.setState({
        events: filter(
          orderBy(
            Object.keys(events || {}).map((k) =>
              events[k]
            ), 'start', 'asc'
          ), (e) => {
            if (e.end) {
              return moment(e.end).clone().endOf('day') >= moment();
            } else {
              return moment(e.start).clone().endOf('day') >= moment();
            }
          })
          .slice(0, 4)
      });
    }
  }

  render() {
    const { events } = this.state;
    return (
      <div style={{width:'700px', maxWidth:'100%', minHeight:'200px'}}>
        <div style={{display:'flex', alignItems:'flex-end', paddingBottom:'10px'}}>
          <Link className='fadein' to='/schedule'
                style={{animationDelay:'1.5s', fontWeight:'normal', color:'#aaa', fontSize:'16px'}}>
            Upcoming Events
          </Link>
        </div>
        <div style={{display:'flex', flexWrap:'wrap'}}>
          {(events || []).map((c, ci) => {
            let summary = c.summary || c.description;
            if (summary && summary.length > 100) {
              summary = summary.substring(0,97) + '...';
            }
            return (
              <div key={c.uid} className='fadein'
                   style={{flex:'0 0 165px', marginRight:'10px', borderRadius:'6px', backgroundColor:'white',
                           boxShadow:'0 0 1px rgba(0,0,0,.18), 0 2px 4px rgba(0,0,0,.13)',
                           animationDelay:(1.5 + (ci * 0.1)) + 's', marginBottom:'10px'}}>
                <div style={{padding:'8px 20px', backgroundColor:'#eaeaea', color:'#212121', fontSize:'13px',
                             borderRadius:'6px 6px 0px 0px', fontWeight:'bold'}}>
                  {moment(c.start).format('ddd MMM D')}
                </div>
                <div style={{padding:'10px 20px', display:'flex', flexDirection:'column', height:'150px'}}>
                  <Link style={{fontWeight:'bold', fontSize:'14px', marginTop:'5px', color:'#212121'}}
                        to={'/schedule/' + c.uid}>
                    {c.name}
                  </Link>
                  <div style={{color:'#8BC34A', marginTop:'5px', display:'flex', alignItems:'center'}}>
                    <Icon icon='access_time' iconStyle={{color:'#8bc34a', fontSize:'16px', marginRight:'3px'}} />
                    <div>{moment(c.start).format('h:mm a')}</div>
                  </div>
                  <div style={{color:'#bbb', marginTop:'8px', fontSize:'12px'}}>{summary}</div>
                  <div style={{flex:'1 1 auto'}} />
                  <Link style={{color:'#795548', fontSize:'12px'}} to={'/schedule/' + c.uid}>
                    Read More &rarr;
                  </Link>
                </div>
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
    events: state.hbc.events
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
)(Dashboard);