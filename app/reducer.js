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
        user: action.err ? undefined : (action.user || state.user),
        authErr: action.err
      });
    case 'FETCH_USERS':
      return Object.assign({}, state, {
        users: action.users || {}
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