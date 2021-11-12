import { Chip, Avatar } from '@material-ui/core';
import React from 'react';
import { isUrl } from '../../Functions/IsURL';

export const UrlChip = (props: {
  url?: string;
  isDisable?: boolean;
  textContent?: string;
}) => {
  const disable = props.isDisable ?? false;
  const converToChip = (chain?: string) => {
    //check definition
    if (chain === undefined) return undefined;
    //check if dir is url or physical
    const gmaps = 'https://www.google.com/maps?q=';
    if (isUrl(chain)) {
      return (
        <Chip
          avatar={<Avatar>Z</Avatar>}
          label='video'
          href={chain}
          target='_blank'
          clickable
          color={disable ? 'default' : 'primary'}
          component='a'
        />
      );
      //return <a href={chain}> link al taller </a>;
    } else {
      return (
        <Chip
          avatar={<Avatar>D</Avatar>}
          label={props.textContent === undefined ? 'mapa' : props.textContent}
          href={`${gmaps}${chain.replace(' ', '+')}`}
          target='_blank'
          clickable
          color={disable ? 'default' : 'primary'}
          component='a'
        />
      );
      //return <a href={`${gmaps}${chain.replace(' ', '+')}`}> dirección del taller </a>;
    }
  };
  return <>{converToChip(props.url)}</>;
};
