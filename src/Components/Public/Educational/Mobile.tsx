import Typography from '@material-ui/core/Typography';
import os_android from '../../../Assets/os_android.svg';
import os_apple from '../../../Assets/os_apple.svg';
import os_desktop from '../../../Assets/os_desktop.svg';
import './Mobile.css';

type MobileOS = {
  os: 'android' | 'apple' | 'desktop';
  link: string;
};
interface MobileProps {
  name: string;
  description: string;
  logo: string;
  size: number;
  platform: MobileOS[];
}

class MobileApp implements MobileProps {
  readonly name: string;
  readonly logo: string;
  readonly description: string;
  readonly size: number;
  readonly platform: MobileOS[];
  constructor(input: MobileProps) {
    this.name = input.name;
    this.logo = input.logo;
    this.description = input.description;
    this.size = input.size;
    this.platform = input.platform.sort((a, b) => (a > b ? 1 : -1));
  }

  component(): JSX.Element {
    return (
      <article className='mobile-app-item'>
        <div className='mobile-side-panel'>
          {/* side panel by default opacity 0 */}
          <h5>{this.name}</h5>
          <p>
            {this.description} <span>.</span>{' '}
          </p>
          {this.buildButtons()}
        </div>
        <img src={this.logo} alt={this.name} />
        <h5>{this.name}</h5>
        <div className='mobile-over-panel'>{this.buildButtons()}</div>
      </article>
    );
  }

  private getOsLogo(os: 'android' | 'apple' | 'desktop') {
    switch (os) {
      case (os = 'android'):
        return <img src={os_android} alt={os} />;
      case (os = 'apple'):
        return <img src={os_apple} alt={os} />;
      case (os = 'desktop'):
        return <img src={os_desktop} alt={os} />;
      default:
        return undefined;
    }
  }
  private buildButtons() {
    return (
      <div className='os-selector-container'>
        {this.platform.map((osVersion) => {
          return (
            <a href={osVersion.link} target='_blank' rel='noreferrer'>
              <div className='os-button'>{this.getOsLogo(osVersion.os)}</div>
            </a>
          );
        })}
      </div>
    );
  }
}

const Mobile = () => {
  const appList: MobileApp[] = [
    new MobileApp({
      name: 'Explora Tu Energía',
      logo: 'https://play-lh.googleusercontent.com/q5py2ne3MfyW9DgXBx70E3c8Zev9ELfaBp3tBLF_X0f4iuZaD5nqmVw9T_5FpBRWog=w240-h480-rw',
      description: 'Explora la energía con Realidad Vitual',
      size: 100,
      platform: [
        {
          os: 'android',
          link: 'https://play.google.com/store/apps/details?id=cl.minenergia.exploratuenergia&hl=es_419&gl=US',
        },
        {
          os: 'apple',
          link: 'https://apps.apple.com/cl/app/explora-tu-energ%C3%ADa/id1494385419',
        },
      ],
    }),
    new MobileApp({
      name: 'Mi Casa Eficiente',
      logo: 'https://play-lh.googleusercontent.com/S4wK5irqUb5bncIR6teT1Xg4_b00Sfg5U1YbFb0L5IsN-5HdLS-EbyZxboG1Uq3btOw=w240-h480-rw',
      description: 'Aprende cómo ahorrar energía en tu Hogar',
      size: 40,
      platform: [
        {
          os: 'android',
          link: 'https://play.google.com/store/apps/details?id=cl.MinEnergia.CasaEficiente&hl=gl&gl=US',
        },
        {
          os: 'apple',
          link: 'https://apps.apple.com/us/app/mi-casa-eficiente/id1521973518',
        },
      ],
    }),
    new MobileApp({
      name: 'Energy Quiz',
      logo: 'https://play-lh.googleusercontent.com/AMGRGB5vD_D_x22vzpxE-t_tGIRHo5D5jbIYYVpekOVFTwMND1e_HMyhi2F1RP3DBs8=w240-h480-rw',
      description: 'Estruja tu 🧠 con esta trivia energética',
      size: 100,
      platform: [
        {
          os: 'android',
          link: 'https://play.google.com/store/apps/details?id=cl.minenergia.EnergyQuiz&hl=es_CL&gl=US',
        },
        {
          os: 'apple',
          link: 'https://apps.apple.com/cl/app/energy-quiz/id1521973619',
        },
      ],
    }),
  ];

  return (
    <section id='mobile-section'>
      <Typography className='section-name' variant='caption' color='primary'>
        Apps interactivas
      </Typography>
      <ul>
        {appList.map((it, index) => {
          return <li id={`app-${index}`}>{it.component()}</li>;
        })}
      </ul>
    </section>
  );
};

export default Mobile;
