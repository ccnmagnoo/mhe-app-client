import React from 'react';
import { Action, initialState, mheReducer, State } from './reducer';

//context
export const Context = React.createContext(initialState);
//context provider

const Provider: React.FC = (props) => {
  //importing useReducer
  const [state, dispatch] = React.useReducer(mheReducer, initialState);

  const init: State = {
    ...state,
    changeState: (action: Action) => dispatch(action),
  };

  return <Context.Provider value={init}>{props.children}</Context.Provider>;
};

export default Provider;
