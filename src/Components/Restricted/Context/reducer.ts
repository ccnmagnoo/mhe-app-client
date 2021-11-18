import { IClassroom } from '../../../Models/Classroom.interface';

//config storage
export interface State {
  periodStart: number;
  period: number;
  rooms: IClassroom[];
  changeState: (value: Action) => void;
}

//start states
export const initialState: State = {
  periodStart: 2016,
  period: new Date().getFullYear(),
  rooms: [],
  changeState: () => {},
};

//type actions
export enum ActionType {
  setPeriod = 'SET_PERIOD',
  setRooms = 'SET_ROOMS',
  updateRoom = 'UPDATE_ROOM',
}

//action type
export type Action = {
  type: ActionType;
  payload: IClassroom | IClassroom[] | number;
};

//actions functions

//reducer
export const mheReducer: React.Reducer<State, Action> = (
  state: State,
  action: Action
) => {
  //deconstruct action
  const { type, payload } = action;

  //state on return depending of type Action
  switch (type) {
    //set current year to operate app ⏱️
    case ActionType.setPeriod: {
      //set period to fetch
      const load = payload as number;
      return { ...state, period: load };
    }

    //set rooms of current year 👨‍🏫
    case ActionType.setRooms: {
      //decrease fruits from last one
      const load = payload as IClassroom[];
      return { ...state, rooms: load };
    }
    //on update data of some room
    case ActionType.updateRoom: {
      const load = payload as IClassroom;
      const index = state.rooms.findIndex((room) => room.uuid === load.uuid);
      //find wich room to update
      state.rooms.splice(index, 1, load);

      return { ...state, rooms: state.rooms };
    }
    default:
      return state;
  }
};
