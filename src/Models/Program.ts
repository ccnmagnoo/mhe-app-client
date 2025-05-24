type SocialProgram = 'Con Buena Energía' | 'Siempre Listos';

const socialContext: Record<
  SocialProgram,
  { program: SocialProgram; goal: string; logoUrl: string }
> = {
  'Con Buena Energía': {
    program: 'Con Buena Energía',
    goal: 'educación energética',
    logoUrl: '/cbe_logo.png', // inside /%PUBLIC%/ folder
  },
  'Siempre Listos': {
    program: 'Siempre Listos',
    goal: 'resiliencia energética',
    logoUrl: '/siempre_listos_logo.png', // inside /%PUBLIC%/ folder
  },
};

export default SocialProgram;
export { socialContext };
