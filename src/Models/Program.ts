import cbe_cover from '../Assets/cbe_cover.png';
import sl_cover from '../Assets/siempre_listos_cover.png';
type SocialProgram = 'Con Buena Energía' | 'Siempre Listos';

const socialContext: Record<
  SocialProgram,
  {
    program: SocialProgram;
    goal: string;
    logoUrl: string;
    app_background: string;
    ppt_cover?: string;
    ppt_url?: string;
  }
> = {
  'Con Buena Energía': {
    program: 'Con Buena Energía',
    goal: 'educación energética',
    logoUrl: '/cbe_logo.png', // inside /%PUBLIC%/ folder
    app_background: '/cbe_background.png',// inside /%PUBLIC%/ folder
    ppt_cover: 'cbe_cover.png',
    ppt_url:
      'https://www.canva.com/design/DAFTEzGMFcA/t6NmmMB20q7-8IrfbFqVbw/view?utm_content=DAFTEzGMFcA&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2d9e6de5e5',
  },
  'Siempre Listos': {
    program: 'Siempre Listos',
    goal: 'resiliencia energética',
    logoUrl: '/siempre_listos_logo.png', // inside /%PUBLIC%/ folder
    app_background: '/siempre_listos_background.png',// inside /%PUBLIC%/ folder
    ppt_cover: 'siempre_listos_cover.png',
    ppt_url:
      'https://www.canva.com/design/DAGx7netNPk/Cw_Rc0C545BJCaOn52DqEQ/view?utm_content=DAGx7netNPk&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=h2cfa0fc138',
  },
};

// const currentContext = socialContext[process.env.REACT_APP_NAME!! as SocialProgram];
const currentContext = socialContext['Siempre Listos'];

export default SocialProgram;
export { socialContext, currentContext };
