import React from 'react';
import { initialState, mheReducer, setPeriod, State } from './reducer';

//context
export const Context = React.createContext(initialState);
//context provider

const Provider: React.FC = (props) => {
  //importing useReducer
  const [state, dispatch] = React.useReducer(mheReducer, initialState);

  const initial: State = {
    ...state,
    setNewPeriod: () => dispatch(setPeriod),
  };

  return <Context.Provider value={initialState}>{props.children}</Context.Provider>;
};

export default Provider;
