import React from 'react';
import {
  Card,
  CardHeader,
  Avatar,
  CardActions,
  Button,
  Typography,
} from '@material-ui/core';
import moment from 'moment';
import { IRoom } from '../../Models/Classroom.interface';
//icons

import PersonPinIcon from '@material-ui/icons/PersonPin';

type TClassroomCard = {
  item: IRoom;
  selectedRoom: IRoom | undefined;
  setSelectedRoom: React.Dispatch<React.SetStateAction<IRoom | undefined>>;
  disableC: boolean;
  setDisableS: React.Dispatch<React.SetStateAction<boolean>>;
};

const ClassroomCard = (props: TClassroomCard) => {
  const { item, selectedRoom, setSelectedRoom, disableC, setDisableS } = props;
  const currentVacancies = () => {
    const res = (item.vacancies ?? 100) - item.enrolled.length;
    return res >= 0 ? res : 0;
  };
  const isSelected = selectedRoom?.uuid === item.uuid;
  const backgroundColor = () => {
    return isSelected ? 'AliceBlue' : 'transparent';
  };

  return (
    <>
      <Card style={{ backgroundColor: backgroundColor() }}>
        <CardHeader
          avatar={<Avatar aria-label='idcal'>{item.colaborator.substring(0, 1)}</Avatar>}
          action={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyItems: 'center',
                alignItems: 'center',
                fontFamily: 'arial',
              }}
            >
              <PersonPinIcon color={isSelected ? 'primary' : 'inherit'} />
              <Typography variant='h5' color={isSelected ? 'primary' : 'inherit'}>
                {currentVacancies()}
              </Typography>
              <div style={{ fontSize: '0.8rem', color: 'gray' }}>cupos</div>
            </div>
          }
          title={item.colaborator}
          subheader={moment(item.dateInstance).format('dd DD MMM h:mm a')}
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
