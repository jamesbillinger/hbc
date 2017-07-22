/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';

export default class About extends Component {
  render() {
    const { history, location } = this.props;
    return (
      <div style={{position:'absolute', top:'0px', right:'0px', bottom:'0px', left:'0px',
                   display:'flex', justifyContent:'center'}}>
        <div style={{width:'600px', maxWidth:'100%', margin:'4vw'}}>
          <p>The Hays Baseball Club was created in 2013 as a home for </p>
          <p>
            Our mission is to provide an equal opportunity for young men from Hays and the surrounding areas
            to develop as baseball players; having the chance to complete at a high level while instilling discipline,
            teamwork, sportsmanship, and integrity.
          </p>
          <p>
            The HBC teaches its players to respect the game, work hard, and play hard.
          </p>
          <ul>
            <li>
              The goal each year is to have 2 teams (up to 22 kids) per age division (8U, 9U, 10U, etc).
              Age group determination is based on the child's age as of April 30th of each year.
            </li>
            <li>
              Each team should be comprised of 10 or 11 players.
              The goal is to continue to recruit until the total number or players
            </li>
            <li>
              The HBC board will assign coaches for each team.  Interested parents
            </li>
          </ul>
        </div>
      </div>
    );
  }
}