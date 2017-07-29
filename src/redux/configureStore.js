import * as redux from 'redux';
import thunk from 'redux-thunk';

// import reducers
import { userReducer, uiReducer, votedMessagesReducer } from './reducers';

export const configure = (initialState = {}) => {
  // combine all reducers into a single one
  const reducer = redux.combineReducers({
    user: userReducer,
    ui: uiReducer,
    votedMessages: votedMessagesReducer
  });

  // use the combined reducer to create the store
  // also apply redux-thunk middleware and devToolsExtension
  const store = redux.createStore(reducer, initialState, redux.compose(
    redux.applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;
};
