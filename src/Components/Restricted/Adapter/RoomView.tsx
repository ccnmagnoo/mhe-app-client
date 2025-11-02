/* eslint-disable @typescript-eslint/no-unused-vars */
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
import React, { lazy, Suspense } from 'react';
import { IRoom } from '../../../Models/Classroom.interface';

//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupIcon from '@material-ui/icons/Group';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import SettingsApplicationsIcon from '@material-ui/icons/SettingsApplications';
import InfoIcon from '@material-ui/icons/Info';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import DeleteIcon from '@material-ui/icons/Delete';

import { UrlChip } from '../../Public/UrlChip';
// import ListView from './ListView';
import { Link, useRouteMatch, withRouter } from 'react-router-dom';
import { SettingsApplications } from '@material-ui/icons';

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

type ViewOption = 'subscribed' | 'validated';

const RoomView = (props: RoomViewProps) => {
  const ListView = lazy(() => import('./ListView'));

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
  console.log('url split', splited);
  splited.splice(2, 1);
  const jointed = splited.join('/');

  //states 🅿⛽ list with details

  const [typeListView, setTypeListView] = React.useState<ViewOption | null>(null);

  const getListView = () => {
    if (typeListView === null) return undefined;

    const selector: { [key: string]: boolean } = {
      subscribed: false,
      validated: true,
    };

    return (
      <Grid item xs={12}>
        <Suspense
          fallback={
            <Typography variant='caption' color='initial'>
              loading
            </Typography>
          }
        >
          <ListView room={room} workDone={selector[typeListView]} key={room.idCal} />
        </Suspense>
      </Grid>
    );
  };

  return (
    <Accordion
      expanded={expanded === room.uuid}
      onChange={handleAccordionChange(room.uuid)}
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
              style={{ fontSize: '.7rem' }}
              avatar={<Avatar>{props.workDone ? '✓' : '⏱'}</Avatar>}
              label={room.idCal.slice(1)}
              color={props.workDone ? 'primary' : 'secondary'}
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Grid item xs={12}>
              <Typography variant='caption' color='initial'>
                {props.workDone
                  ? moment(room.placeActivity.date).locale('es').format('dd DD MMM H:mm')
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
            <Typography variant='caption' color='initial' style={{ fontSize: '.8rem' }}>
              {room.colaborator.replace('Municipalidad', 'M.')}
            </Typography>
            <br />
            <Typography
              variant='caption'
              color='initial'
              style={{ fontSize: '.6rem', color: '#a1a1a1' }}
            >
              {room.program}
            </Typography>
          </Grid>
          {!props.workDone ? (
            <Grid item xs={1} sm={1} container direction='column' alignItems='center'>
              <Badge
                variant='standard'
                badgeContent={room.enrolled.length}
                max={999}
                color='secondary'
              >
                <GroupIcon color='primary' titleAccess={'inscritos'} />
              </Badge>
              <Typography
                variant='caption'
                color='textSecondary'
                style={{ fontSize: '.6rem' }}
              >
                <div style={{ width: '50px' }}>
                  quedan{' '}
                  <span style={{ fontWeight: 'bold' }}>
                    {room.vacancies ? room.vacancies - room.enrolled.length : '0'}
                  </span>
                </div>
              </Typography>
            </Grid>
          ) : undefined}

          {props.workDone ? (
            <Grid item xs={6} sm={1}>
              <Grid container direction='column'>
                <Grid item sm={12} xs={12}>
                  <Typography variant='caption' color='textSecondary' align='center'>
                    <strong style={{ color: '#3f51b5', fontSize: '.9rem' }}>
                      {room.attendees.length}
                    </strong>
                    /{room.enrolled.length}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant='caption'
                    color='textSecondary'
                    align='left'
                    style={{ fontSize: '.9rem' }}
                  >
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
      <AccordionDetails key={room.uuid}>
        <Grid container spacing={1} alignItems='center' justify='flex-end'>
          <Grid item>
            <UrlChip url={room.placeActivity.dir} isDisable={props.workDone} />
          </Grid>
          <Grid item>
            <UrlChip
              url={room.placeDispatch?.dir}
              isDisable={!props.workDone}
              textContent={`entrega`}
            />
          </Grid>

          <Grid item alignContent='stretch'>
            <ButtonGroup
              variant='outlined'
              color='primary'
              aria-label='actividades-view'
              size='small'
              style={{ fontSize: '.8rem' }}
            >
              <Button
                color='primary'
                component='a'
                href={`/vacancies?id=${room.uuid}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                <InfoIcon titleAccess='info pública' />
              </Button>

              <Button
                onClick={() => {
                  setTypeListView('subscribed');
                }}
              >
                <AssignmentIndIcon titleAccess='inscritos' />
                in
              </Button>

              <Button
                disabled={!props.workDone}
                onClick={() => {
                  setTypeListView('validated');
                }}
              >
                <AssignmentTurnedInIcon titleAccess='consolidados' />
                ok
              </Button>
              <Button
                component={Link}
                to={`${jointed}/editroom/${room.uuid}?workDone=${props.workDone}`}
              >
                <SettingsApplicationsIcon />
              </Button>
              {/* <Button disabled>
                <DeleteIcon />
              </Button> */}
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
