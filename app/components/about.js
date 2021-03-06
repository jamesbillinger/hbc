/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as Actions from 'app/actions';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { Link } from 'react-router-dom';
import Logo from 'components/logo';
import AbsoluteWrapper from 'components/absoluteWrapper';

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
      <AbsoluteWrapper>
        <div style={{width:'600px', maxWidth:'100%', flex:'1 0 auto'}}>
          <div style={{paddingBottom:'20px', height:'60px', display:'flex', flexDirection:'column', width:'100%'}}>
            <Logo text='About' />
          </div>
          <div className='content' style={{animationDelay:'0.5s'}}>
            <p>
              The Hays Baseball Club was created in 2013 with the goal of providing a competitive, high quality baseball
              experience for area youth.
            </p>
            <p>
              Our mission is to provide an equal opportunity for young men from Hays and the surrounding areas
              to develop as baseball players; having the chance to complete at a high level while instilling discipline,
              teamwork, sportsmanship, and integrity.
            </p>
            <p>
              The HBC teaches its players to respect the game, work hard, and play hard.
            </p>
          </div>
          <div style={{paddingBottom:'20px', animationDelay:'0.7s'}} className='content'>
            {Object.keys(faqs || {}).map((k) => {
              let q = faqs[k];
              return (
                <Card key={k} style={{marginBottom:'10px'}}>
                  <CardHeader title={q.question} actAsExpander={true} showExpandableButton={true}
                              style={{backgroundColor:'#DCEDC8', padding:'12px 16px'}} />
                  <CardText expandable={true} style={{whiteSpace:'pre-wrap'}}>
                    {q.answer}
                  </CardText>
                </Card>
              );
            })}
            {questions.map((q, qi) =>
              <Card key={qi} style={{marginBottom:'10px'}}>
                <CardHeader title={q.title} actAsExpander={true} showExpandableButton={true}
                            style={{backgroundColor:'#DCEDC8', padding:'12px 16px'}} />
                <CardText expandable={true} style={{whiteSpace:'pre-wrap'}}>
                  {q.answer}
                </CardText>
              </Card>
            )}
          </div>
        </div>
      </AbsoluteWrapper>
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