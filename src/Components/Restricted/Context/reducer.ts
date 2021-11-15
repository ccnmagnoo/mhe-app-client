import { IClassroom } from '../../../Models/Classroom.interface';

//config storage
export interface State {
  period: number;
  rooms: IClassroom[];
  setNewPeriod: () => void;
  setRooms: () => void;
  updateRoom: () => void;
}

//start states
export const initialState: State = {
  period: new Date().getFullYear(),
  rooms: [],
  setNewPeriod: () => {},
  setRooms: () => {},
  updateRoom: () => {},
};

//type actions
enum ActionType {
  setPeriod = 'SET_PERIOD',
  setRooms = 'SET_ROOMS',
  updateRoom = 'UPDATE_ROOM',
}

//action type
export type Actions = {
  type: ActionType;
  payload: IClassroom | IClassroom[] | number;
};

//actions functions
export let setPeriod = {
  type: ActionType.setPeriod,
  payload: 2016,
};

//reducer
export const mheReducer: React.Reducer<State, Actions> = (
  state: State,
  action: Actions
) => {
  //deconstruct action
  const { type, payload } = action;

  //state on return depending of type Action
  switch (type) {
    case ActionType.setPeriod: {
      //set period to fetch
      const load = payload as number;
      return { ...state, period: load };
    }
    case ActionType.setRooms: {
      //decrease fruits from last one
      return { ...state, rooms: state.rooms };
    }
    default:
      return state;
  }
};
