import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../Assets/cbelogo.svg';

type LogoProps = {
  size: number;
  name: string;
};

export const Logo = (props: LogoProps) => {
  return (
    <>
      <Link to='/'>
        <img
          className='button'
          style={{ filter: 'drop-shadow(2px 2px 2px rgb(0 0 0 / 0.2))' }}
          src={logo}
          alt='logo taller'
          width={props.size}
        />
      </Link>
    </>
  );
};
