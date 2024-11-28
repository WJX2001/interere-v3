import { Box, BoxProps, Typography } from '@mui/material';
import React, { ReactNode } from 'react';

interface RowProps extends BoxProps {
  caption?: ReactNode;
  captionVariant?:
    | 'secondary16'
    | 'description'
    | 'subheader1'
    | 'caption'
    | 'h3';
  captionColor?: string;
  align?: 'center' | 'flex-start';
}
const Row: React.FC<RowProps> = ({
  caption,
  children,
  captionVariant = 'secondary16',
  captionColor,
  align = 'center',
  ...rest
}) => {
  return (
    <Box
      {...rest}
      sx={{
        display: 'flex',
        alignItems: align,
        justifyContent: 'space-between',
        ...rest.sx,
      }}
    >
      {caption && (
        <Typography
          component="div"
          variant={captionVariant}
          color={captionColor}
          sx={{ mr: 2 }}
        >
          {caption}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default Row;
