import React from 'react';
import { Link } from 'react-router-dom';

const logo = require(`../../../${process.env.REACT_APP_LOGO}`);

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
          style={{
            filter: 'drop-shadow(2px 2px 2px rgb(0 0 0 / 0.2))',
            margin: '1rem .5rem',
            width: '250px',
          }}
          src={logo}
          alt='logo taller'
          width={props.size}
        />
      </Link>
    </>
  );
};
