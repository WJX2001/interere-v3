import { Box, Button, Link, SvgIcon, Typography } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import XIcon from '@mui/icons-material/X';
import React from 'react';
const FOOTER_LINKS = [
  {
    href: 'https://aave.com/terms-of-service',
    label: 'Terms',
    key: 'Terms',
  },
  {
    href: 'https://aave.com/privacy-policy/',
    label: 'Privacy',
    key: 'Privacy',
  },
  {
    href: 'https://docs.aave.com/hub/',
    label: 'Docs',
    key: 'Docs',
  },
  {
    href: 'https://docs.aave.com/faq/',
    label: 'FAQS',
    key: 'FAQS',
  },
];

const FOOTER_ICONS = [
  {
    href: 'https://github.com/WJX2001/interere-v3',
    icon: <GitHubIcon />,
    title: 'Github',
  },
  {
    href: '',
    icon: <XIcon fontSize="small" />,
    title: 'Lens',
  },
  
];

const AppFooter = () => {
  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        padding: ['22px 0px 40px 0px', '0 22px 0 40px', '20px 22px'],
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '22px',
        flexDirection: ['column', 'column', 'row'],
        height: '60px',
        boxShadow:
          theme.palette.mode === 'light'
            ? 'inset 0px 1px 0px rgba(0, 0, 0, 0.04)'
            : 'inset 0px 1px 0px rgba(255, 255, 255, 0.12)',
      })}
    >
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {FOOTER_LINKS.map((link) => (
          <Link
            underline="none"
            key={link.key}
            sx={(theme) => ({
              color: theme.palette.text.muted,
              '&:hover': {
                color: theme.palette.text.primary,
              },
              display: 'flex',
            })}
          >
            <Typography variant="caption" sx={{ fontSize: '0.75rem' }}>
              {link.label}
            </Typography>
          </Link>
        ))}
      </Box>
      <Box
        sx={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {FOOTER_ICONS.map((icon) => (
          <Link href={icon.href} key={icon.title} target="_blank">
            <SvgIcon
              sx={{
                fontSize: '16px',
                color: '#8E92A3',
              }}
            >
              {icon.icon}
            </SvgIcon>
          </Link>
        ))}
      </Box>
    </Box>
  );
};

export default AppFooter;
