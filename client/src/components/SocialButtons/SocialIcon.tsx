import { IconButton, Tooltip } from '@material-ui/core';
import React from 'react';

interface ISocialIconProps {
  className?: string;
  icon: React.ReactNode;
  href: string;
  text: string;
}
const SocialItem = ({ className, icon, href, text }: ISocialIconProps) => {
  return (
    <Tooltip title={text}>
      <IconButton className={className} href={href} target="_blank">
        {icon}
      </IconButton>
    </Tooltip>
  );
};

export default SocialItem;
