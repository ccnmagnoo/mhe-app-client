import { isUrl } from './IsURL';

const convertToUrl = (chain?: string) => {
  //check definition
  if (chain === undefined) return undefined;
  //check if dir is url or physical
  const gmaps = 'https://www.google.com/maps?q=';
  if (isUrl(chain)) {
    return <a href={chain}> {chain}</a>;
  } else {
    return <a href={`${gmaps}${chain.replace(' ', '+')}`}>{chain}</a>;
  }
};

export default convertToUrl;
