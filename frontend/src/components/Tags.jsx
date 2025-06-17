import React from 'react';
import { Chip, Box, Typography } from '@mui/material';

const Tags = ({ tags, onTagClick, variant = 'suggested' }) => {
  if (!tags || tags.length === 0) return null;

  const getChipStyles = () => {
    if (variant === 'selected') {
      return {
        backgroundColor: 'success.light',
        color: 'success.contrastText',
        '&:hover': {
          backgroundColor: 'success.main',
        },
      };
    }
    return {
      backgroundColor: 'primary.light',
      color: 'primary.contrastText',
      '&:hover': {
        backgroundColor: 'primary.main',
      },
    };
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 1,
      mt: 2, 
      mb: 2,
      px: 2
    }}>
      <Typography variant="subtitle2" color="text.secondary">
        {variant === 'selected' ? 'Selected Tags' : 'Suggested Tags'}
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1,
      }}>
        {tags.map((tag, index) => (
          <Chip
            key={index}
            label={tag}
            onClick={() => onTagClick?.(tag)}
            sx={getChipStyles()}
          />
        ))}
      </Box>
    </Box>
  );
};

export default Tags; 