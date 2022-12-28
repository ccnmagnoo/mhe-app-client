/* eslint-disable react/jsx-no-target-blank */
/* eslint-disable jsx-a11y/iframe-has-title */

import Typography from '@material-ui/core/Typography';

// position: 'relative',
// width: '100%',
// height: '0',
// padding-top: '56.2500%',
// padding-bottom: '0',
// box-shadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
// marginTop: 1.6em,
// marginBottom: '0.9em',
// overflow: 'hidden',
// border: '8px',
// will-change: 'transform',

export const Expo = () => {
  return (
    <section id='expo-section'>
      <div style={{ marginTop: '1em' }}>
        <Typography variant='caption' color='primary'>
          Presentaciones
        </Typography>
      </div>
      <div
        id='expo-container'
        style={{
          position: 'relative',
          width: '100%',
          height: '0',
          paddingTop: '56.2500%',
          paddingBottom: '0',
          boxShadow: '0 2px 8px 0 rgba(63,69,81,0.16)',
          marginTop: '0',
          marginBottom: '0.9em',
          overflow: 'hidden',
          border: '8px',
          willChange: 'transform',
        }}
      >
        <iframe
          loading='lazy'
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: '0',
            left: '0',
            border: 'none',
            padding: '0',
            margin: '0',
          }}
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
