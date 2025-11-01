/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/iframe-has-title */

import Typography from '@material-ui/core/Typography';
import './Expo.css';
import { currentContext as ctx } from '../../../Models/Program';

export const Expo = () => {
  return (
    <section id='expo-section'>
      <div style={{ marginTop: '1em' }}>
        <Typography className='section-name' variant='caption' color='primary'>
          Presentaciones
        </Typography>
      </div>
      <div></div>
      <div
        id='expo-container'
        style={{
          willChange: 'transform',
        }}
      >
        <img width='100%' src={ctx.ppt_cover} alt='presentation cover' />
      </div>
      <a
        style={{
          opacity: 1,
          position: 'relative',
          fontFamily: 'monospace',
          width: '150px',
          height: '0',
          left: '20px',
          top: '-55px',
          textDecoration: 'none',
          border: '2px solid White',
          color: 'white',
          padding: '5px',
          borderRadius: '4px',
          backgroundColor: 'rgb(255,255,255,0.3)',
        }}
        href={ctx.ppt_url}
        target='_blank'
        rel='noopener'
      >
        fuente
      </a>
    </section>
  );
};
