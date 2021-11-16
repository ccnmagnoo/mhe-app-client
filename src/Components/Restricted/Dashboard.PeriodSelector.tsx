import React from 'react';
import { Slider, Grid, Typography } from '@material-ui/core';
import { Context } from './Context/context';
import { Action, ActionType } from './Context/reducer';
import { useFetchRooms } from './Hooks/useFetchRooms';

export const PeriodSelector = () => {
  //useContext provider
  const context = React.useContext(Context);
  //remove and use contaxt
  const currentYear = new Date().getFullYear();
  const [thisYear, setThisYear] = React.useState<number>(currentYear);
  function handleChange(e: React.ChangeEvent<{}>, value: number | number[]): void {
    //local state
    setThisYear(value as number);
    //reducer state period selected
    let handleAction: Action = { type: ActionType.setPeriod, payload: value as number };
    context.changeState(handleAction);
    console.log('year selection: ', thisYear);

    //fetch firebase data 🔥🔥🔥
  }
  useFetchRooms();

  return (
    <>
      <Grid container spacing={2} justify='flex-end'>
        <Grid item xs={9}>
          <Slider
            defaultValue={currentYear}
            onChangeCommitted={handleChange}
            aria-labelledby='Año'
            step={1}
            marks={
              [
                //{ value: 2016, label: '2016' },
                //{ value: currentYear, label: currentYear.toString() },
              ]
            }
            min={2016}
            max={currentYear}
            valueLabelDisplay='auto'
          />
        </Grid>
        <Grid item xs={3}>
          <Typography
            variant='body2'
            color='primary'
            style={{
              color: 'SteelBlue',
              fontStyle: 'bold',
              padding: '5px',
              textAlign: 'left',
            }}
          >
            {context.period}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};
