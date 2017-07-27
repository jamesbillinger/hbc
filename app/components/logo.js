/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';
import { AutoSizer } from 'react-virtualized';

const colors = ['#689F38','#8BC34A','#DCEDC8','#795548','#212121','#757575'];
const sizes = [10,12,14,14,10,10,12,10,12,14,10,12,14,10,10,12,14,10];
const textTransforms = ['lowercase','lowercase','none']; //capitalize

export default class Logo extends Component {
  componentWillMount() {
    const { text } = this.props;
    this._divs = [];
    text.split(' ').map((w, wi) => {
      w.split('').map((c, ci) => {
        this._divs.push({
          color: sample(colors),
          size: sample(sizes),
          textTransform: ci === 0 ? 'none' : sample(textTransforms),
          character: (ci === 0 && wi > 0) ? <span>&nbsp;{c}</span> : c
        });
      });
    });
  }

  render() {
    const { large } = this.props;
    return (
      <div style={{flex:'1 1 auto', width:'100%'}}>
        <AutoSizer>
          {({height, width}) => {
            return (
              <div style={{height:height + 'px', width: width + 'px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div style={{display:'flex', alignItems:'flex-end', height: height + 'px', marginBottom:(height * -.75) + 'px'}}>
                  {this._divs.map((c, ci) => {
                    let fontSize = width / c.size;
                    if (large && width < 800) {
                      fontSize = (width * (800 / width)) / c.size;
                    }
                    return (
                      <div key={ci} className='logo'
                           style={{
                             color: c.color,
                             fontSize: fontSize + 'px',
                             textTransform: c.textTransform,
                             marginRight: '2px',
                             paddingBottom:(c.size * 1.3) + 'px',
                             animationDelay: (0.1 + (ci * 0.03)) + 's'
                           }}>
                        {c.character}
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