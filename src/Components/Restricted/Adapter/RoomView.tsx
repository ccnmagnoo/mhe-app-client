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
import { IRoom } from '../../../Models/Classroom.interface';

//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import TocIcon from '@material-ui/icons/Toc';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

import { UrlChip } from '../../Public/UrlChip';
import { ListView } from './ListView';
import { Link, useRouteMatch, withRouter } from 'react-router-dom';

/**
 * @function RoomView panel for individual params of each room
 * @param workDone boolean related if its an incoming or outgoing activity
 */
type RoomViewProps = {
  workDone: boolean /*if true, so activity to fetch is consolidated in past*/;
  room: IRoom;
  expanded: string | boolean;
  handleAccordionChange: (
    panel: string
  ) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => void;
};

const RoomView = (props: RoomViewProps) => {
  //input props 🍗🎱🐣
  const room = props.room;
  const expanded = props.expanded;
  const handleAccordionChange = props.handleAccordionChange;
  //router dom
  /**
   * removing child url and going to parent url
   */
  let { url } = useRouteMatch();
  const splited = url.split('/');
  splited.splice(2, 1);
  const jointed = splited.join('/');

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
                  ? moment(room.placeActivity.date).locale('es').format('DD MMM')
                  : moment(room.placeActivity.date).locale('es').format('dd DD MMM H:mm')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='caption' color='primary'>
                {props.workDone
                  ? moment(room.placeActivity.date).startOf('hours').fromNow()
                  : moment(room.placeActivity.date).endOf('hours').fromNow()}
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
              <Badge
                variant='standard'
                badgeContent={room.enrolled.length}
                max={999}
                color='secondary'
              >
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
        <Grid container spacing={2} alignItems='center' justify='space-evenly'>
          <Grid item xs={6} sm={3}>
            <UrlChip url={room.placeActivity.dir} isDisable={props.workDone} />
          </Grid>
          <Grid item xs={6} sm={5}>
            <UrlChip
              url={room.placeDispatch?.dir}
              isDisable={!props.workDone}
              textContent={`entrega el ${room.placeDispatch?.date.toLocaleDateString(
                'es-ES'
              )}`}
            />
          </Grid>

          <Grid item xs={12} sm={4} alignContent='stretch'>
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
              <Button component={Link} to={`${jointed}/editroom/${room.uuid}`}>
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

export default React.memo(withRouter<any, any>(RoomView));
