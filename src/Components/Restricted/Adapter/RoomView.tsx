import {
  Accordion,
  AccordionSummary,
  Grid,
  Chip,
  Avatar,
  Typography,
  AccordionDetails,
  Badge,
  Button,
  ButtonGroup,
} from '@material-ui/core';
import moment from 'moment';
import 'moment/locale/es'; // Pasar a español
import React from 'react';
import { IClassroom } from '../../../Models/Classroom.interface';

//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import TocIcon from '@material-ui/icons/Toc';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { UrlChip } from '../../Public/UrlChip';
import { ListView } from './ListView';

const RoomView = (props: {
  workDone: boolean /*if true, so activity to fetch is consolidated in past*/;
  room: IClassroom;
  expanded: string | boolean;
  handleAccordionChange: (
    panel: string
  ) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => void;
}) => {
  //input props 🍗🎱🐣
  const room = props.room;
  const expanded = props.expanded;
  const handleAccordionChange = props.handleAccordionChange;

  //states 🅿⛽ list with details

  const [typeListView, setTypeListView] = React.useState<
    null | 'suscribed' | 'validated'
  >(null);

  const getListView = () => {
    switch (typeListView) {
      case 'suscribed': {
        return (
          <Grid item xs={12}>
            <ListView room={room} workDone={false} />
          </Grid>
        );
      }
      case 'validated': {
        return (
          <Grid item xs={12}>
            <ListView room={room} workDone={true} />
          </Grid>
        );
      }
      default:
        return undefined;
    }
  };

  return (
    <Accordion
      expanded={expanded === room.idCal}
      onChange={handleAccordionChange(room.idCal)}
    >
      {/*summary accordion head 🤯🤯*/}
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1bh-content'
        id='panel1bh-header'
      >
        <Grid container spacing={2} alignItems='center' justify='space-evenly'>
          <Grid item xs={6} sm={2}>
            <Chip
              avatar={<Avatar>R</Avatar>}
              label={room.idCal.slice(1)}
              color={props.workDone ? 'primary' : 'secondary'}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Grid item xs={12}>
              <Typography variant='caption' color='initial'>
                {props.workDone
                  ? moment(room.placeActivity.date).locale('es').format('DD [de] MMMM')
                  : moment(room.placeActivity.date)
                      .locale('es')
                      .format('DD [de] MMM h:mm a')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='caption' color='primary'>
                {props.workDone
                  ? moment(room.placeActivity.date).startOf('day').fromNow()
                  : moment(room.placeActivity.date).endOf('day').fromNow()}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant='caption' color='initial'>
              {room.colaborator}
            </Typography>
          </Grid>
          {!props.workDone ? (
            <Grid item xs={6} sm={3}>
              <Badge badgeContent={room.enrolled.length} max={999} color='secondary'>
                <GroupIcon color='primary' titleAccess={'inscritos'} />
              </Badge>
            </Grid>
          ) : undefined}

          {props.workDone ? (
            <Grid item xs={6} sm={3}>
              <Grid container direction='column'>
                <Grid item xs={12}>
                  <Typography variant='body1' color='primary' align='left'>
                    <strong>{room.attendees.length}</strong>
                    <Typography variant='body2' color='textSecondary' display='inline'>
                      {' '}
                      / {room.enrolled.length}
                    </Typography>
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant='caption' color='textSecondary' align='left'>
                    {room.enrolled.length === 0
                      ? 0
                      : Math.floor((room.attendees.length / room.enrolled.length) * 100)}
                    %
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          ) : undefined}
        </Grid>
      </AccordionSummary>

      {/*summary details 🤯🤯*/}
      <AccordionDetails>
        <Grid container spacing={2} alignItems='center' justify='space-between'>
          <Grid item xs={6}>
            <UrlChip url={room.placeActivity.dir} isDisable={props.workDone} />
          </Grid>

          <Grid item xs={6}>
            <ButtonGroup
              variant='text'
              color='primary'
              aria-label='actividades-view'
              size='small'
            >
              <Button
                onClick={() => {
                  setTypeListView('suscribed');
                }}
              >
                <TocIcon />
              </Button>
              <Button
                disabled={!props.workDone}
                onClick={() => {
                  setTypeListView('validated');
                }}
              >
                <PlaylistAddCheckIcon />
              </Button>
              <Button>
                <EditIcon />
              </Button>
              <Button>
                <DeleteIcon />
              </Button>
            </ButtonGroup>
          </Grid>

          {/*List of people 😀😁😂🤣🤣🤣*/}
          {getListView()}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export { RoomView as RoomAccordion };
