import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../Assets/cbelogo.svg';

type LogoProps = {
  size: number;
  name: string;
};

export const Logo = (props: LogoProps) => {
  return (
    <React.Fragment>
      <Link to='/'>
        <img className='button' src={logo} alt='logo taller' width={props.size} />
      </Link>
    </React.Fragment>
  );
};
