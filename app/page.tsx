'use client';

import React, { useState, useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import ThemeProvider from '@mui/material/styles/ThemeProvider';
import createTheme from '@mui/material/styles/createTheme';
import CssBaseline from '@mui/material/CssBaseline';
import { alpha } from '@mui/material/styles';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { useNotes } from './context/NotesContext';
import { useTheme } from './hooks/useTheme';
import NoteDialog from './components/NoteDialog';
import ThemeMenu from './components/ThemeMenu';
import { Note } from './types';
import ClientOnly from './components/ClientOnly';
import { MainMenu } from './components/MainMenu';
import SearchBar from './components/SearchBar';
import TagSelector from './components/TagSelector';
import NewNoteButton from './components/NewNoteButton';

export default function Home() {
  const {
    notes,
    tags,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const { theme, isDarkMode, setTheme, setIsDarkMode, themeOptions } =
    useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

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

  const toggleNoteExpansion = (noteId: string) => {
    setExpandedNotes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  const muiTheme = useMemo(() => createTheme({
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
          ? theme.colors.dark.background
          : theme.colors.light.background,
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: isDarkMode
              ? alpha(theme.colors.dark.primary, 0.05)
              : alpha(theme.colors.light.primary, 0.05),
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiInputBase-root': {
              backgroundColor: isDarkMode
                ? alpha(theme.colors.dark.primary, 0.05)
                : alpha(theme.colors.light.primary, 0.05),
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
          inputRoot: {
            backgroundColor: isDarkMode
              ? alpha(theme.colors.dark.primary, 0.05)
              : alpha(theme.colors.light.primary, 0.05),
          },
        },
      },
    },
  }), [isDarkMode, theme]);

  return (
    <ClientOnly>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AppBar position="static" className="mb-4">
          <Toolbar>
            <MainMenu />
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
        <Container maxWidth="md" sx={{ mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <SearchBar />
            <TagSelector key={tags.join(',')} />
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
                        WebkitLineClamp: expandedNotes.has(note.id) ? undefined : 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: expandedNotes.has(note.id) ? 'visible' : 'hidden',
                        cursor: 'pointer',
                      }}
                      onClick={() => toggleNoteExpansion(note.id)}
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

          <NewNoteButton onNewNote={handleAddNote} />

          <NoteDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSave={handleSaveNote}
            existingNote={editingNote}
          />
        </Container>
      </ThemeProvider>
    </ClientOnly>
  );
}
