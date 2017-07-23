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
        user: action.user,
        authErr: action.err
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