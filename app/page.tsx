'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
import CssBaseline from '@mui/material/CssBaseline';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import { Cedarville_Cursive } from 'next/font/google'
import Stack from '@mui/material/Stack';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Button from '@mui/material/Button';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

import { useNotes } from './context/NotesContext';
import { useTheme } from './context/ThemeContext';
import NoteDialog from './components/NoteDialog';
import { MainMenu } from './components/MainMenu';
import SearchBar from './components/SearchBar';
import TagSelector from './components/TagSelector';
import NewNoteButton from './components/NewNoteButton';
import ClientOnly from './components/ClientOnly';
import { Note } from './types';
import { isInputFocused } from './utils/keyboard';
import RandomNotesButton from './components/RandomNotesButton';
import RandomNotesDialog from './components/RandomNotesDialog';
import ViewToggle from './components/ViewToggle';
import { format } from 'date-fns';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';

const cedarville = Cedarville_Cursive({ 
  weight: '400',
  subsets: ['latin'] 
})

export default function Home() {
  const {
    notes,
    tags,
    addNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const { 
    theme, 
    isDarkMode, 
    muiTheme
  } = useTheme();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null);
  const [randomNotesOpen, setRandomNotesOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'date' | 'tags'>('date');
  const [collapsedTags, setCollapsedTags] = useState<Set<string>>(() => {
    return new Set();
  });
  const [allTagsExpanded, setAllTagsExpanded] = useState(true);
  const [allDatesExpanded, setAllDatesExpanded] = useState(true);
  const [collapsedDates, setCollapsedDates] = useState<Set<string>>(new Set());
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    noteId: string | null;
  }>({ open: false, noteId: null });

  const groupedNotes = useMemo(() => {
    const groups: { [key: string]: Note[] } = {};
    
    notes.forEach((note) => {
      const dateKey = format(new Date(note.createdAt), 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(note);
    });
    
    return groups;
  }, [notes]);

  const handleAddNote = () => {
    setEditingNote(undefined);
    setDialogOpen(true);
  };

  const handleEditNote = useCallback((note: Note) => {
    setEditingNote(note);
    setDialogOpen(true);
  }, []);

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

  const toggleTagSection = (tag: string) => {
    setCollapsedTags(prev => {
      const newSet = new Set(prev);
      if (newSet.has(tag)) {
        newSet.delete(tag);
      } else {
        newSet.add(tag);
      }
      return newSet;
    });
  };

  const toggleAllTags = useCallback(() => {
    setAllTagsExpanded(prev => !prev);
    if (allTagsExpanded) {
      setCollapsedTags(new Set([...tags, 'Untagged']));
    } else {
      setCollapsedTags(new Set());
    }
  }, [allTagsExpanded, tags]);

  const toggleAllDates = useCallback(() => {
    setAllDatesExpanded(prev => !prev);
    if (allDatesExpanded) {
      const allDates = Object.keys(groupedNotes);
      setCollapsedDates(new Set(allDates));
    } else {
      setCollapsedDates(new Set());
    }
  }, [allDatesExpanded, groupedNotes]);

  const notesByTags = useMemo(() => {
    const byTags: { [key: string]: Note[] } = {};
    
    notes.forEach(note => {
      if (note.tags.length === 0) {
        byTags['Untagged'] = byTags['Untagged'] || [];
        byTags['Untagged'].push(note);
      } else {
        note.tags.forEach(tag => {
          byTags[tag] = byTags[tag] || [];
          byTags[tag].push(note);
        });
      }
    });

    return Object.entries(byTags)
      .sort(([a], [b]) => {
        if (a === 'Untagged') return 1;
        if (b === 'Untagged') return -1;
        return a.localeCompare(b);
      });
  }, [notes]);

  const handleDeleteNote = (noteId: string) => {
    setDeleteConfirmation({ open: true, noteId });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmation.noteId) {
      deleteNote(deleteConfirmation.noteId);
    }
    setDeleteConfirmation({ open: false, noteId: null });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isInputFocused()) return;
      if (!hoveredNoteId) return;

      if (e.key.toLowerCase() === 'e') {
        const note = notes.find(n => n.id === hoveredNoteId);
        if (note) {
          e.preventDefault();
          handleEditNote(note);
        }
      }
      
      if (e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDeleteNote(hoveredNoteId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hoveredNoteId, notes, handleEditNote]);

  useEffect(() => {
    document.title = `Halp notes - ${new Date().toLocaleDateString()}`;
  }, []);

  return (
    <ClientOnly>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AppBar 
          position="static" 
          elevation={0}
          sx={{ 
            backgroundColor: isDarkMode 
              ? theme.colors.dark.background 
              : theme.colors.light.background,
            mb: 4 
          }}
        >
          <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3 } }}>
            <Toolbar disableGutters>
              <Typography 
                variant="h4" 
                component="div" 
                sx={{ 
                  flexGrow: 1,
                  fontSize: '2.5rem',
                  display: 'flex',
                  alignItems: 'baseline',
                  color: isDarkMode 
                    ? theme.colors.dark.primary 
                    : theme.colors.light.primary,
                  mt: 2
                }}
              >
                <span className={cedarville.className}>Halp</span>
                <span style={{ fontSize: '1.25rem', marginLeft: '0.5rem' }}>
                  notes
                </span>
              </Typography>
              <MainMenu 
                sx={{ 
                  color: isDarkMode 
                    ? theme.colors.dark.primary 
                    : theme.colors.light.primary
                }} 
              />
            </Toolbar>
          </Container>
        </AppBar>
        <Container maxWidth="md" sx={{ mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <SearchBar />
            <TagSelector key={tags.join(',')} />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <ViewToggle view={viewMode} onViewChange={setViewMode} />
            {viewMode === 'tags' ? (
              <Button
                startIcon={allTagsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={toggleAllTags}
                size="small"
                sx={{ color: 'text.primary' }}
              >
                {allTagsExpanded ? 'Collapse All' : 'Expand All'}
              </Button>
            ) : (
              <Button
                startIcon={allDatesExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                onClick={toggleAllDates}
                size="small"
                sx={{ color: 'text.primary' }}
              >
                {allDatesExpanded ? 'Collapse All' : 'Expand All'}
              </Button>
            )}
          </Box>

          {viewMode === 'date' ? (
            <div className="w-full space-y-4 mt-4">
              {Object.entries(groupedNotes)
                .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                .map(([date, notes]) => (
                  <div key={date}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        cursor: 'pointer',
                        mb: collapsedDates.has(date) ? 0 : 2,
                      }}
                      onClick={() => {
                        setCollapsedDates(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(date)) {
                            newSet.delete(date);
                          } else {
                            newSet.add(date);
                          }
                          return newSet;
                        });
                      }}
                    >
                      <CalendarTodayIcon sx={{ mr: 1 }} color="primary" />
                      <Typography 
                        variant="h6" 
                        component="h2" 
                      >
                        {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ ml: 2 }}
                      >
                        {notes.length} note{notes.length !== 1 ? 's' : ''}
                      </Typography>
                      <Box sx={{ ml: 'auto' }}>
                        {collapsedDates.has(date) ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                      </Box>
                    </Box>
                    {!collapsedDates.has(date) && (
                      <Grid container spacing={2}>
                        {notes.map((note) => (
                          <Grid item xs={12} sm={6} key={note.id}>
                            <Card
                              tabIndex={0}
                              onMouseEnter={() => setHoveredNoteId(note.id)}
                              onMouseLeave={() => setHoveredNoteId(null)}
                              sx={{
                                height: '100%',
                                position: 'relative',
                                '&:focus': {
                                  outline: `2px solid ${isDarkMode ? theme.colors.dark.primary : theme.colors.light.primary}`,
                                  outlineOffset: '2px',
                                },
                                '& .note-actions': {
                                  opacity: 0,
                                  transition: 'opacity 0.2s ease-in-out',
                                  position: 'absolute',
                                  bottom: 8,
                                  right: 8,
                                  display: 'flex',
                                  gap: 1,
                                  zIndex: 1,
                                  '& .MuiIconButton-root': {
                                    backgroundColor: isDarkMode 
                                      ? alpha(theme.colors.dark.primary, 0.1)
                                      : alpha(theme.colors.light.primary, 0.1),
                                    padding: '4px',
                                    boxShadow: 2,
                                    '&:hover': {
                                      backgroundColor: isDarkMode 
                                        ? alpha(theme.colors.dark.primary, 0.2)
                                        : alpha(theme.colors.light.primary, 0.2),
                                    }
                                  }
                                },
                                '&:hover .note-actions, &:focus-within .note-actions': {
                                  opacity: 1,
                                },
                              }}
                            >
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
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {note.tags.map((tag) => (
                                    <Chip key={tag} label={tag} size="small" />
                                  ))}
                                </Box>
                                <Box
                                  className="note-actions"
                                  sx={{ 
                                    display: 'flex', 
                                    '& .MuiIconButton-root': {
                                      backgroundColor: isDarkMode 
                                        ? alpha(theme.colors.dark.primary, 0.1)
                                        : alpha(theme.colors.light.primary, 0.1),
                                      padding: '4px',
                                      boxShadow: 2,
                                      '&:hover': {
                                        backgroundColor: isDarkMode 
                                          ? alpha(theme.colors.dark.primary, 0.2)
                                          : alpha(theme.colors.light.primary, 0.2),
                                      }
                                    }
                                  }}
                                >
                                  <Tooltip title="Edit note (E)" arrow placement="top">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleEditNote(note)}
                                    >
                                      <EditIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                  <Tooltip title="Delete note (D)" arrow placement="top">
                                    <IconButton
                                      size="small"
                                      onClick={() => handleDeleteNote(note.id)}
                                    >
                                      <DeleteIcon sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <Stack spacing={4}>
              {notesByTags.map(([tag, notes]) => (
                <Box key={tag}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      mb: collapsedTags.has(tag) ? 0 : 2,
                      cursor: 'pointer'
                    }}
                    onClick={() => toggleTagSection(tag)}
                  >
                    <LocalOfferIcon sx={{ mr: 1 }} color="primary" />
                    <Typography variant="h6" component="h2">
                      {tag}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      sx={{ ml: 2 }}
                    >
                      {notes.length} note{notes.length !== 1 ? 's' : ''}
                    </Typography>
                    <Box sx={{ ml: 'auto' }}>
                      {collapsedTags.has(tag) ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                    </Box>
                  </Box>
                  {!collapsedTags.has(tag) && (
                    <Grid container spacing={2}>
                      {notes.map((note) => (
                        <Grid item xs={12} sm={6} key={note.id}>
                          <Card
                            tabIndex={0}
                            onMouseEnter={() => setHoveredNoteId(note.id)}
                            onMouseLeave={() => setHoveredNoteId(null)}
                            sx={{
                              height: '100%',
                              position: 'relative',
                              '&:focus': {
                                outline: `2px solid ${isDarkMode ? theme.colors.dark.primary : theme.colors.light.primary}`,
                                outlineOffset: '2px',
                              },
                              '& .note-actions': {
                                opacity: 0,
                                transition: 'opacity 0.2s ease-in-out',
                                position: 'absolute',
                                bottom: 8,
                                right: 8,
                                display: 'flex',
                                gap: 1,
                                zIndex: 1,
                                '& .MuiIconButton-root': {
                                  backgroundColor: isDarkMode 
                                    ? alpha(theme.colors.dark.primary, 0.1)
                                    : alpha(theme.colors.light.primary, 0.1),
                                  padding: '4px',
                                  boxShadow: 2,
                                  '&:hover': {
                                    backgroundColor: isDarkMode 
                                      ? alpha(theme.colors.dark.primary, 0.2)
                                      : alpha(theme.colors.light.primary, 0.2),
                                  }
                                }
                              },
                              '&:hover .note-actions, &:focus-within .note-actions': {
                                opacity: 1,
                              },
                            }}
                          >
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
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {note.tags.map((tag) => (
                                  <Chip key={tag} label={tag} size="small" />
                                ))}
                              </Box>
                              <Box
                                className="note-actions"
                                sx={{ 
                                  display: 'flex', 
                                  '& .MuiIconButton-root': {
                                    backgroundColor: isDarkMode 
                                      ? alpha(theme.colors.dark.primary, 0.1)
                                      : alpha(theme.colors.light.primary, 0.1),
                                    padding: '4px',
                                    boxShadow: 2,
                                    '&:hover': {
                                      backgroundColor: isDarkMode 
                                        ? alpha(theme.colors.dark.primary, 0.2)
                                        : alpha(theme.colors.light.primary, 0.2),
                                    }
                                  }
                                }}
                              >
                                <Tooltip title="Edit note (E)" arrow placement="top">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleEditNote(note)}
                                  >
                                    <EditIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete note (D)" arrow placement="top">
                                  <IconButton
                                    size="small"
                                    onClick={() => handleDeleteNote(note.id)}
                                  >
                                    <DeleteIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              ))}
            </Stack>
          )}

          <NewNoteButton onNewNote={handleAddNote} />
          <RandomNotesButton onClick={() => setRandomNotesOpen(true)} />

          <NoteDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            onSave={handleSaveNote}
            existingNote={editingNote}
          />

          <RandomNotesDialog
            open={randomNotesOpen}
            onClose={() => setRandomNotesOpen(false)}
            notes={notes}
            availableTags={tags}
          />

          <Dialog
            open={deleteConfirmation.open}
            onClose={() => setDeleteConfirmation({ open: false, noteId: null })}
          >
            <DialogTitle>Delete Note</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this note? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => setDeleteConfirmation({ open: false, noteId: null })}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmDelete} 
                color="error" 
                variant="contained"
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </ThemeProvider>
    </ClientOnly>
  );
}
