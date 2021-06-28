import { Card, Avatar, CardHeader, IconButton } from '@material-ui/core';
import React from 'react';
import { MoreVert as MoreVertIcon } from '@material-ui/icons';
import moment from 'moment';
import 'moment/locale/es';

export const ClassroomAdapter = () => {
  const classDate = new Date();
  const myTime = moment(classDate).format('dddd DD MMMM YYYY');

  return (
    <React.Fragment>
      <Card>
        <CardHeader
          avatar={<Avatar aria-label=''>R</Avatar>}
          action={
            <IconButton aria-label=''>
              <MoreVertIcon />
            </IconButton>
          }
          title='R295 Prodemu Quillota'
          subheader={myTime}
        />
      </Card>
    </React.Fragment>
  );
};
