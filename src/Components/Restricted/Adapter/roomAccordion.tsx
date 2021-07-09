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
  Box,
} from '@material-ui/core';
import moment from 'moment';
import React from 'react';
import { IClassroom } from '../../../Models/Classroom.interface';

//icons
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import GroupAddIcon from '@material-ui/icons/GroupAdd';
import VisibilityIcon from '@material-ui/icons/Visibility';

import { UrlChip } from '../../Public/UrlChip';
import { refUuid } from '../../../Config/credential';
import { dbKey } from '../../../Models/databaseKeys';
import { db } from '../../../Config/firebase';
import { IPerson, iPersonConverter } from '../../../Models/Person.Interface';
import { TableOfPeople } from './TableOfPeople';

const RoomAccordion = (props: {
  room: IClassroom;
  expanded: string | boolean;
  handleAccordionChange: (
    panel: string
  ) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => void;
}) => {
  //input props
  const room = props.room;
  const expanded = props.expanded;
  const handleAccordionChange = props.handleAccordionChange;

  //states
  const [enrolled, setEnrolled] = React.useState<IPerson[]>([]);

  //call beneficiaries/suscribed
  const onSubmitBeneficiaries = async () => {
    //call firebase suscribed
    try {
      const ref = db
        .collection(`${dbKey.act}/${refUuid}/${dbKey.sus}`)
        .withConverter(iPersonConverter);
      const promises = room.enrolled.map((uuid) => {
        return ref.doc(uuid).get();
      });
      //Promise all
      const snapshot = await Promise.all(promises);
      console.log('snapshots', snapshot.length, 'first', snapshot[0].data());

      //create list of persons without undef
      const listOfPerson: IPerson[] = [];
      for (let snap of snapshot) {
        const it = snap.data();
        if (it !== undefined) {
          console.log('push beneficiary', it.rut);
          listOfPerson.push(it);
        }
      }

      setEnrolled(listOfPerson);

      //
    } catch (error) {
      console.log('error fetching suscribed', error);
    }
  };

  const getList = () => {
    console.log(
      'loading list',
      enrolled.map((it) => it.rut)
    );

    if (enrolled.length > 0) {
      return (
        <Grid item xs={12}>
          <TableOfPeople people={enrolled} />
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
              color='secondary'
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <Grid item xs={12}>
              <Typography variant='caption' color='initial'>
                {moment(room.placeActivity.date).format('DD [de] MMM h:mm a')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='caption' color='primary'>
                {moment(room.placeActivity.date).endOf('day').fromNow()}
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={6} sm={4}>
            <Typography variant='caption' color='initial'>
              {room.colaborator}
            </Typography>
          </Grid>

          <Grid item xs={6} sm={3}>
            <Badge badgeContent={room.enrolled.length} color='secondary'>
              <GroupAddIcon color='primary' titleAccess={'inscritos'} />
            </Badge>
          </Grid>
        </Grid>
      </AccordionSummary>

      <AccordionDetails>
        <Grid container spacing={2} alignItems='center' justify='space-between'>
          <Grid item xs={6}>
            <UrlChip url={room.placeActivity.dir} />
          </Grid>

          <Grid item xs={6}>
            <ButtonGroup
              variant='text'
              color='primary'
              aria-label='actividades-view'
              size='small'
            >
              <Button onClick={onSubmitBeneficiaries}>
                <VisibilityIcon />
              </Button>
              <Button>editar</Button>
              <Button>borrar</Button>
            </ButtonGroup>
          </Grid>

          {/*List of people 😀😁😂🤣🤣🤣*/}
          {getList()}
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export { RoomAccordion };
