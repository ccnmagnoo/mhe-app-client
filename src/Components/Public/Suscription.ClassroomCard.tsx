import React from 'react';
import {
  Card,
  CardHeader,
  Avatar,
  IconButton,
  CardActions,
  Button,
} from '@material-ui/core';
import moment from 'moment';
import { IClassroom } from '../../Models/Classroom.interface';
//icons

import CheckCircleIcon from '@material-ui/icons/CheckCircle';

type TClassroomCard = {
  item: IClassroom;
  selectedRoom: IClassroom | undefined;
  setSelectedRoom: React.Dispatch<React.SetStateAction<IClassroom | undefined>>;
  disableC: boolean;
  setDisableS: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClassroomCard = (props: TClassroomCard) => {
  const { item, selectedRoom, setSelectedRoom, disableC, setDisableS } = props;
  const isSelected = selectedRoom?.uuid === item.uuid;
  const backgroundColor = () => {
    return isSelected ? 'AliceBlue' : 'transparent';
  };

  return (
    <>
      <Card style={{ backgroundColor: backgroundColor() }}>
        <CardHeader
          avatar={<Avatar aria-label='idcal'>{item.idCal.replace('R', '')}</Avatar>}
          action={
            <IconButton aria-label='seleccionar'>
              <CheckCircleIcon color={isSelected ? 'primary' : 'inherit'} />
            </IconButton>
          }
          title={`${item.idCal} ${item.colaborator}`}
          subheader={moment(item.dateInstance).format('dddd DD MMM h:mm a')}
        />
        <CardActions>
          <Button
            size='small'
            disabled={disableC}
            color={isSelected ? 'primary' : 'default'}
            variant={isSelected ? 'contained' : 'outlined'}
            onClick={() => {
              console.log('selected class', item.idCal);
              setSelectedRoom(item);
              setDisableS(false);
            }}
          >
            selecionar
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ClassroomCard;
