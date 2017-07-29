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
        authEmail: action.email,
        groups: action.groups || state.groups,
        initialLoadComplete: state.initialLoadComplete || (!action.user || !!action.groups)
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

    case 'LOAD_AGEGROUPS':
      return Object.assign({}, state, {
        ageGroups: action.ageGroups,
        ageGroupMin: action.min,
        ageGroupMax: action.max
      });

    case 'FETCH_FAQS':
      return Object.assign({}, state, {
        faqs: action.faqs || {}
      });

    case 'FETCH_CONTACTS':
      return Object.assign({}, state, {
        contacts: action.contacts || {}
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