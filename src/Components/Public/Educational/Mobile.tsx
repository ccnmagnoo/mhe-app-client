import Typography from '@material-ui/core/Typography';

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
      <article className='Mobile-app-item'>
        <img src={this.logo} alt={this.name} width={100} height={100} />
      </article>
    );
  }
}

const Mobile = () => {
  const appList: MobileApp[] = [
    new MobileApp({
      name: 'Explora Tu Energía',
      logo: 'https://play-lh.googleusercontent.com/q5py2ne3MfyW9DgXBx70E3c8Zev9ELfaBp3tBLF_X0f4iuZaD5nqmVw9T_5FpBRWog=w240-h480-rw',
      description: 'explora con realidad virtual de donde viene tu energía',
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
  ];

  return (
    <section id='mobile-section'>
      <Typography variant='caption' color='primary'>
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
