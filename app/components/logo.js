/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';
import { AutoSizer } from 'react-virtualized';

const s = 'Hays Baseball Club';
const colors = [
  '#689F38','#8BC34A','#DCEDC8','#212121','#795548','#212121','#757575'
];
const sizes = shuffle([10,12,14,14,10,10,12,10,12,14,10,12,14,10,10,12,14,10]);
const textTransforms = [
  'capitalize','lowercase','none','lowercase',
  'none',
  'capitalize','none','none','none','lowercase','initial','inherit','none',
  'none',
  'capitalize','lowercase','initial','inherit'
];

export default class Logo extends Component {
  render() {
    const { history, location } = this.props;
    return (
      <div style={{flex:'1 1 auto', width:'100%'}}>
        <AutoSizer>
          {({height, width}) => {
            console.log(width, height, sample(sizes), width / sample(sizes));
            return (
              <div style={{height:height + 'px', width: width + 'px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div style={{display:'flex', alignItems:'flex-end'}}>
                  {s.split('').map((c, ci) => {
                    return (
                      <div key={ci}
                           style={{
                             color: sample(colors),
                             fontSize: (width / sizes[ci]) + 'px',
                             textTransform: textTransforms[ci],
                             marginRight: '2px',
                             fontWeight:'600',
                             paddingBottom:(sizes[ci] * 1.3) + 'px'
                           }}>
                        {c}
                        {c === ' ' && <span>&nbsp;</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          }}
        </AutoSizer>
      </div>
    );
  }
}