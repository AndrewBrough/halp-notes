import { Box, Typography, Chip } from '@mui/material';
import KeyboardIcon from '@mui/icons-material/Keyboard';
import { SHORTCUT_CATEGORIES, formatShortcut } from '../../constants/shortcuts';

export function KeyboardShortcutsSection() {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <KeyboardIcon sx={{ mr: 1 }} />
        <Typography variant="subtitle2">
          Keyboard Shortcuts
        </Typography>
      </Box>
      {Object.entries(SHORTCUT_CATEGORIES).map(([category, shortcuts]) => (
        <Box key={category} sx={{ mb: 2 }}>
          <Typography 
            variant="overline" 
            sx={{ 
              display: 'block',
              mb: 0.5 
            }}
          >
            {category}
          </Typography>
          {Object.entries(shortcuts).map(([key, shortcut]) => (
            <Typography
              key={key} 
              variant="body2"
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '12px',
                width: '100%',
                alignItems: 'center',
                mb: 0.5
              }}
            >
              <Chip 
                label={formatShortcut(shortcut.keys)}
                size="small"
                variant="outlined"
                sx={{ 
                  fontFamily: 'monospace',
                  borderRadius: '4px',
                  height: '24px'
                }}
              />
              {shortcut.description}
            </Typography>
          ))}
        </Box>
      ))}
    </>
  );
} 