/**
 * Created by jamesbillinger on 4/18/17.
 */
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

const initialState = {};
function hbc(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_AUTH':
      return Object.assign({}, state, {
        user: action.err ? undefined : action.user,
        authErr: action.err,
        initialLoadComplete: true
      });

    case 'FETCH_USERS':
      return Object.assign({}, state, {
        users: action.users || {}
      });

    case 'FETCH_TEAMS':
      return Object.assign({}, state, {
        teams: action.teams || {}
      });

    case 'FETCH_PLAYERS':
      return Object.assign({}, state, {
        players: action.players || {}
      });

    case 'UPDATE_USER':
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, {
          uid: action.uid,
          ...action.update
        })
      });

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  hbc,
  form: formReducer
});

export default rootReducer;