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
  setRoom = 'SET_ROOM',
  setRooms = 'SET_ROOMS',
  delAllRooms = 'DEL_ALL_ROOMS',
  delRoom = 'DEL_ROOM',
  updateRoom = 'UPDATE_ROOM',
}

//action type
export type Action = {
  type: ActionType;
  payload: IClassroom | IClassroom[] | number;
  index?: number;
};

//actions functions

//reducer
export const mheReducer: React.Reducer<State, Action> = (
  state: State,
  action: Action
) => {
  //deconstruct action
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { type, payload, index } = action;

  //state on return depending of type Action
  switch (type) {
    //set current year to operate app ⏱️
    case ActionType.setPeriod: {
      //set period to fetch
      const load = payload as number;
      return { ...state, period: load };
    }

    //add 1 room each time ➕
    case ActionType.setRoom: {
      //decrease fruits from last one
      const load = payload as IClassroom;
      const newRooms = [...state.rooms];
      newRooms.push(load);
      return { ...state, rooms: newRooms };
    }

    //set rooms of current year ➕➕
    case ActionType.setRooms: {
      //decrease fruits from last one
      const load = payload as IClassroom[];
      return { ...state, rooms: load };
    }

    //delete all rooms 🧺
    case ActionType.delAllRooms: {
      return { ...state, rooms: [] };
    }

    case ActionType.delRoom: {
      const load = payload as IClassroom;
      const index = state.rooms.findIndex((room) => room.uuid === load.uuid);
      const rooms = [...state.rooms];
      rooms.splice(index, 1);
      return { ...state, rooms: rooms };
    }

    //on update data of some room
    case ActionType.updateRoom: {
      const load = payload as IClassroom;
      const index = state.rooms.findIndex((room) => room.uuid === load.uuid);
      console.log('room state update index:', index);
      //find wich room to update
      const rooms = [...state.rooms];
      rooms.splice(index, 1, load);

      return { ...state, rooms: rooms };
    }
    default:
      return state;
  }
};
