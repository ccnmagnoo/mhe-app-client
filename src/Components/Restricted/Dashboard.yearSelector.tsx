import React from 'react';
import { Slider } from '@material-ui/core';

export const YearSelector = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const [thisYear, setThisYear] = React.useState<number>(currentDate.getFullYear());
  function handleChange(e: React.ChangeEvent<{}>, value: number | number[]): void {
    setThisYear(value as number);
    console.log('year selection: ', thisYear);
  }
  return (
    <>
      <Slider
        defaultValue={currentDate.getFullYear()}
        onChangeCommitted={handleChange}
        aria-labelledby='Año'
        step={1}
        marks={[
          { value: 2016, label: '2016' },
          { value: currentYear, label: currentYear.toString() },
        ]}
        min={2016}
        max={currentYear}
        valueLabelDisplay='auto'
      />
    </>
  );
};
