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
import React from 'react';
import { IClassroom } from '../../../Models/Classroom.interface';

//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import VisibilityIcon from '@material-ui/icons/Visibility';
import GroupIcon from '@material-ui/icons/Group';

import { UrlChip } from '../../Public/UrlChip';
import { refUuid } from '../../../Config/credential';
import { dbKey } from '../../../Models/databaseKeys';
import { db } from '../../../Config/firebase';
import { ListView } from './ListView';
import {
  IBeneficiary,
  iBeneficiaryConverter,
} from '../../../Models/Beneficiary.interface';

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

  const [people, setPeople] = React.useState<IBeneficiary[]>([]);

  //call beneficiaries/suscribed
  const onSubmitPeople = async () => {
    //call firebase suscribed 🔥🔥🔥🔥
    try {
      //change colection router
      const routeDb = props.workDone
        ? `${dbKey.act}/${refUuid}/${dbKey.cvn}` /*consolidated route*/
        : `${dbKey.act}/${refUuid}/${dbKey.sus}`; /*suscrubed route*/
      const ref = db.collection(routeDb).withConverter(iBeneficiaryConverter);
      const promises = room.enrolled.map((uuid) => {
        return ref.doc(uuid).get();
      });
      //Promise all
      const snapshot = await Promise.all(promises);
      console.log('snapshots', snapshot.length, 'first', snapshot[0].data());

      //create list of persons without undef
      const peopleList: IBeneficiary[] = [];
      for (let snap of snapshot) {
        const it = snap.data();
        if (it !== undefined) {
          console.log('push beneficiary', it.rut);
          peopleList.push(it);
        }
      }

      setPeople(peopleList);

      //
    } catch (error) {
      console.log('error fetching suscribed', error);
    }
  };

  const getListView = () => {
    console.log(
      'loading list',
      people.map((it) => it.rut)
    );

    if (people.length > 0) {
      return (
        <Grid item xs={12}>
          <ListView people={people} room={room} />
        </Grid>
      );
    } else {
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
                  ? moment(room.placeActivity.date).format('DD [de] MMMM')
                  : moment(room.placeActivity.date).format('DD [de] MMM h:mm a')}
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
              <Badge badgeContent={room.enrolled.length} color='secondary'>
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
              <Button onClick={onSubmitPeople}>
                <VisibilityIcon />
              </Button>
              <Button>editar</Button>
              <Button>borrar</Button>
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
