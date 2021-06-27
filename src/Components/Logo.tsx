import React from 'react';
import logo from '../Assets/cbelogo.svg';

type LogoProps = {
  size: number;
  name: string;
};

export const Logo = (props: LogoProps) => {
  return (
    <React.Fragment>
      <img src={logo} alt='logo taller' width={props.size} />
    </React.Fragment>
  );
};
