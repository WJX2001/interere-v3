import { MENUITEMS } from '@/constants';
import { Button, List, ListItem, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
const NavItems = () => {

  const navigate = useNavigate();
  const locationInfo = useLocation()
  console.log(locationInfo.pathname === '/swap')
  return (
    <List
      sx={{
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
      }}
      disablePadding
    >
      {MENUITEMS?.map((item, index) => (
        <ListItem
          sx={{
            width: { xs: '100%', md: 'unset' },
            mr: { xs: 0, md: 2 },
          }}
          disablePadding
          key={index}
        >
          <Button
             onClick={() => {
              navigate(item.url)
             }}
             className={clsx({ 'active': location.pathname === item.url })}
            // href={item.url}
            sx={(theme) => ({
              color: '#F1F1F3',
              p: '6px 8px',
              fontSize: '14px',
              position: 'relative',
              '.active&:after, &:hover&:after': {
                transform: 'scaleX(1)',
                transformOrigin: 'bottom left',
              },
              '&:after': {
                content: "''",
                position: 'absolute',
                width: '100%',
                transform: 'scaleX(0)',
                height: '2px',
                bottom: '-6px',
                left: '0',
                background: theme.palette.gradients.aaveGradient,
                transformOrigin: 'bottom right',
                transition: 'transform 0.25s ease-out',
              },
            })}
          >
            {item.title}
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export default NavItems;
