import React from 'react';
import { Slider, Grid, Typography } from '@material-ui/core';
import { Context } from './Context/context';
import { ActionType } from './Context/reducer';
import { useFetchRooms } from './Hooks/useFetchRooms';

export const PeriodSelector = () => {
  //useContext provider
  const context = React.useContext(Context);
  //remove and use contaxt
  const currentYear = new Date().getFullYear();
  const [thisYear, setThisYear] = React.useState<number>(currentYear);

  //on period change
  function handleChange(e: React.ChangeEvent<{}>, value: number | number[]): void {
    //local state
    console.clear();
    console.log('year selection: ', thisYear);
    setThisYear(value as number);
    //reducer state period selected
    context.changeState({ type: ActionType.setPeriod, payload: value as number });
    //clear room state
    context.changeState({ type: ActionType.delAllRooms, payload: value as number });

    //fetch firebase data 🔥🔥🔥
  }
  useFetchRooms();

  return (
    <>
      <Grid container spacing={2} justify='flex-end'>
        <Grid item xs={10}>
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
        <Grid item xs={2}>
          <Typography
            variant='body2'
            color='primary'
            style={{
              color: 'White',
              fontStyle: 'bold',
              fontSize: '0.8rem',
              backgroundColor: 'RoyalBlue	',
              border: '1px solid CornflowerBlue',
              borderRadius: '5px',
              padding: '5px',
              textAlign: 'center',
            }}
          >
            {context.period}
          </Typography>
        </Grid>
      </Grid>
    </>
  );
};
