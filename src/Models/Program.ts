type SocialProgram = 'Con Buena Energía' | 'Siempre Listos';

const socialContext: Record<
  SocialProgram,
  { program: SocialProgram; goal: string; logoUrl: string }
> = {
  'Con Buena Energía': {
    program: 'Con Buena Energía',
    goal: 'educación energética',
    logoUrl: 'https://conbuenaenergia.web.app/cbelogo.svg',
  },
  'Siempre Listos': {
    program: 'Siempre Listos',
    goal: 'resilencia energética',
    logoUrl: 'https://siemprelistos.web.app/siempre_listos.svg',
  },
};

export default SocialProgram;
export { socialContext };
