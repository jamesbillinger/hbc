/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import { Link } from 'react-router-dom';

const questions = [
  {
    title: 'What age groups, and how many kids?',
    answer: 'The goal each year is to have 2 teams (up to 22 kids) per age division (8U, 9U, 10U, etc).\n' +
    ' Each team should be comprised of 10 or 11 players.\n' +
    ' The goal is to continue to recruit until the total number or players equals a round number of whole teams \n' +
    '(i.e. 20 to 22 players for 2 teams)'
  }, {
    title: 'When is the cutoff for the age groups?',
    answer: 'Age group determination is based on the child\'s age as of April 30th of each year.'
  }, {
    title: 'Can children younger than 8 play?',
    answer: 'Children as young as 7 may register.  Depending on the number of kids signed up, we may field a dedicated 7 year old team or they may be mixed in with the 8 year olds.'
  }, {
    title: 'How is the HBC governed?',
    answer: 'Major decisions are referred to a board consisting of the head coaches of each HBC team.  Each vote is equal.'
  }, {
    title: 'I have a question, who should I ask?',
    answer: (
      <span>
        Our <Link to='/contact'>Contact</Link> page has a list of the currenlty assigned coaches.
        Any of them should be able to answer your questions.  Email addresses are provided.
      </span>
    )
  }
];

export default class About extends Component {
  render() {
    const { history, location } = this.props;
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