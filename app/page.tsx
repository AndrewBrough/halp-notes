'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Fab,
  Card,
  CardContent,
  IconButton,
  Grid,
  Chip,
  TextField,
  Autocomplete,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  alpha,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNotes } from './hooks/useNotes';
import { useTheme } from './hooks/useTheme';
import NoteDialog from './components/NoteDialog';
import ThemeMenu from './components/ThemeMenu';
import { Note } from './types';

export default function Home() {
  const {
    notes,
    tags,
    selectedTags,
    searchQuery,
    setSelectedTags,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const { theme, isDarkMode, setTheme, setIsDarkMode, themeOptions } =
    useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();

  const handleAddNote = () => {
    setEditingNote(undefined);
    setDialogOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setDialogOpen(true);
  };

  const handleSaveNote = (title: string, content: string, tags: string[]) => {
    if (editingNote) {
      updateNote(editingNote.id, title, content, tags);
    } else {
      addNote(title, content, tags);
    }
  };

  const muiTheme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: isDarkMode
          ? theme.colors.dark.primary
          : theme.colors.light.primary,
      },
      secondary: {
        main: isDarkMode
          ? theme.colors.dark.secondary
          : theme.colors.light.secondary,
      },
      background: {
        default: isDarkMode
          ? theme.colors.dark.background
          : theme.colors.light.background,
        paper: isDarkMode
          ? alpha(theme.colors.dark.background, 0.8)
          : alpha(theme.colors.light.background, 0.8),
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              backgroundColor: isDarkMode
                ? alpha('#fff', 0.05)
                : alpha('#000', 0.05),
            },
          },
        },
      },
      MuiAutocomplete: {
        styleOverrides: {
          paper: {
            backgroundColor: isDarkMode
              ? theme.colors.dark.background
              : theme.colors.light.background,
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Halp Notes
          </Typography>
          <ThemeMenu
            currentTheme={theme}
            isDarkMode={isDarkMode}
            onThemeChange={setTheme}
            onDarkModeChange={setIsDarkMode}
            themeOptions={themeOptions}
          />
        </Toolbar>
      </AppBar>
      <Container maxWidth="md" sx={{ mt: 10, mb: 4 }}>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Search notes"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Autocomplete
            multiple
            options={tags}
            value={selectedTags}
            onChange={(_, newValue) => setSelectedTags(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Filter by tags" />
            )}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  label={option}
                  onDelete={() => {
                    const newTags = selectedTags.filter(
                      (tag) => tag !== option
                    );
                    setSelectedTags(newTags);
                  }}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
          />
        </Box>

        <Grid container spacing={2}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {note.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {note.content}
                  </Typography>
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}
                  >
                    {note.tags.map((tag) => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleEditNote(note)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => deleteNote(note.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Fab
          color="primary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleAddNote}
        >
          <AddIcon />
        </Fab>

        <NoteDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveNote}
          existingNote={editingNote}
          availableTags={tags}
        />
      </Container>
    </ThemeProvider>
  );
}
