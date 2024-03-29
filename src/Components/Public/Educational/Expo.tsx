/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/iframe-has-title */

import Typography from '@material-ui/core/Typography';
import './Expo.css';

export const Expo = () => {
  return (
    <section id='expo-section'>
      <div style={{ marginTop: '1em' }}>
        <Typography className='section-name' variant='caption' color='primary'>
          Presentaciones
        </Typography>
      </div>
      <div
        id='expo-container'
        style={{
          willChange: 'transform',
        }}
      >
        <iframe
          loading='lazy'
          src='https://www.canva.com/design/DAFTEzGMFcA/view?embed'
          allowFullScreen={true}
          allow='fullscreen'
        />
      </div>
      <a
        style={{
          opacity: 0.5,
          position: 'relative',
          fontFamily: 'monospace',
          width: '150px',
          height: '0',
          left: '20px',
          top: '-70px',
          textDecoration: 'none',
          border: '2px solid White',
          color: 'whitesmoke',
          padding: '5px',
          borderRadius: '2px',
        }}
        href='https:&#x2F;&#x2F;www.canva.com&#x2F;design&#x2F;DAFTEzGMFcA&#x2F;view?utm_content=DAFTEzGMFcA&amp;utm_campaign=designshare&amp;utm_medium=embeds&amp;utm_source=link'
        target='_blank'
        rel='noopener'
      >
        fuente
      </a>
    </section>
  );
};
