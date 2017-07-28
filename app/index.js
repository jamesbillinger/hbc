/**
 * Created by jamesbillinger on 4/2/17.
 */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter, Link, Redirect, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import materialTheme from './materialTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import 'public/fonts/index.css';
import 'public/fonts/material-icons.css';
import 'public/theme.css';
import configureStore from './store';
import Main from 'components/main';
import TopMenu from 'components/topMenu';
import moment from 'moment';

const store  = configureStore({});

class App extends Component {
  state = {};

  componentWillMount() {
    injectTapEventPlugin();
  }


  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider muiTheme={getMuiTheme(materialTheme)}>
          <BrowserRouter>
            <div style={{height:'100%', display:'flex', flexDirection:'column', color:'#212121', fontFamily:'sans-serif'}}>
              <Route component={TopMenu} />
              <div style={{flex:'1 1 auto', width:'100%', position:'relative', minHeight:'400px'}}>
                <Route render={(props) => (
                  <Main {...props} />
                )} />
              </div>
              <div style={{flex:'0 0 40px', color:'#ddd', fontSize:'12px',
                           display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div>Copyright Ⓒ Hays Baseball Club {moment().format('YYYY')}</div>
              </div>
            </div>
          </BrowserRouter>
        </MuiThemeProvider>
      </Provider>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
);