type SocialProgram = 'Con Buena Energía' | 'Siempre Listos';

const socialContext: Record<
  SocialProgram,
  { program: SocialProgram; goal: string; logoUrl: string; app_background: string }
> = {
  'Con Buena Energía': {
    program: 'Con Buena Energía',
    goal: 'educación energética',
    logoUrl: '/cbe_logo.png', // inside /%PUBLIC%/ folder
    app_background: 'https://i.postimg.cc/d1KwfF93/future-energy-turbine.png',
  },
  'Siempre Listos': {
    program: 'Siempre Listos',
    goal: 'resiliencia energética',
    logoUrl: '/siempre_listos_logo.png', // inside /%PUBLIC%/ folder
    app_background: 'https://i.postimg.cc/CxqKrcVv/i-will-survive.png',
  },
};

// const currentContext = socialContext[process.env.REACT_APP_NAME!! as SocialProgram];
const currentContext = socialContext['Siempre Listos'];

export default SocialProgram;
export { socialContext, currentContext };
