import Typography from '@material-ui/core/Typography';

interface VideoProps {
  id: string;
  title: string;
  url?: () => string;
  startAt?: number;
}

class Video implements VideoProps {
  title: string;
  startAt: number;
  id: string;
  constructor(video: VideoProps) {
    this.id = video.id;
    this.title = video.title;
    this.startAt = video.startAt ?? 0;
  }
  url() {
    return `https://youtu.be/${this.id}?t=${this.startAt}`;
  }
  embed(): JSX.Element {
    return (
      <iframe
        width='560'
        height='315'
        src={`https://www.youtube.com/embed/${this.id}`}
        title={this.title}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
        allowFullScreen={true}
      ></iframe>
    );
  }
}

const videoResource: VideoProps[] = [
  new Video({ title: 'El Consumo Vampiro', id: 'EQ2UQWEqsws' }),
  new Video({ title: 'El Gran Consumidor', id: 'cfVINbDXZQQ' }),
  new Video({ title: 'Cuídate del Peligro', id: 'tz8KcOnP2Dg' }),
];

export const Videos = () => {
  return (
    <>
      <Typography variant='caption' color='primary'>
        Multimedia
      </Typography>
    </>
  );
};
