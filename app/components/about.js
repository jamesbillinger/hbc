/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { Link } from 'react-router-dom';

const questions = [
  {
    title: 'I have a question, who should I ask?',
    answer: (
      <span>
        Our <Link to='/contact'>Contact</Link> page has a list of the currenlty assigned coaches.
        Any of them should be able to answer your questions.  Email addresses are provided.
      </span>
    )
  }
];

class About extends Component {
  render() {
    const { history, location, faqs } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center'}}>
        <div style={{width:'600px', maxWidth:'100%', margin:'4vw'}}>
          <p>
            The Hays Baseball Club was created in 2013 as a home for
          </p>
          <p>
            Our mission is to provide an equal opportunity for young men from Hays and the surrounding areas
            to develop as baseball players; having the chance to complete at a high level while instilling discipline,
            teamwork, sportsmanship, and integrity.
          </p>
          <p>
            The HBC teaches its players to respect the game, work hard, and play hard.
          </p>
          <div style={{paddingBottom:'20px'}}>
            {Object.keys(faqs || {}).map((k) => {
              let q = faqs[k];
              return (
                <Card key={k} style={{marginBottom:'10px'}}>
                  <CardHeader title={q.question} actAsExpander={true} showExpandableButton={true}
                              style={{backgroundColor:'#DCEDC8', padding:'12px 16px'}} />
                  <CardText expandable={true}>
                    {q.answer}
                  </CardText>
                </Card>
              );
            })}
            {questions.map((q, qi) =>
              <Card key={qi} style={{marginBottom:'10px'}}>
                <CardHeader title={q.title} actAsExpander={true} showExpandableButton={true}
                            style={{backgroundColor:'#DCEDC8', padding:'12px 16px'}} />
                <CardText expandable={true}>
                  {q.answer}
                </CardText>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    faqs: state.hbc.faqs
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
)(About);