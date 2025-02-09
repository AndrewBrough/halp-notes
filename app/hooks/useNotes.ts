'use client';

import { useState, useEffect, useMemo } from 'react';
import { Note, NotesState, NoteVersion } from '../types';

const STORAGE_KEY = 'notes-app-data';

const tutorialNotes: Note[] = [
  {
    id: 'tutorial-1',
    title: '👋 Welcome to Halp Notes!',
    content: 'Welcome to Halp Notes! This note and the following ones are tagged with "tutorial" to help you get started. You can filter them using the tags selector above. To remove these tutorial notes, simply delete them using the trash icon.',
    tags: ['tutorial'],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    versions: []
  },
  {
    id: 'tutorial-2',
    title: '✍️ Creating and Editing Notes',
    content: 'To create a new note, click the + button in the bottom right corner. To edit an existing note, click the pencil icon on any note card. You can edit the title, content, and tags of your notes at any time.',
    tags: ['tutorial'],
    createdAt: Date.now() - 1000,
    updatedAt: Date.now() - 1000,
    versions: []
  },
  {
    id: 'tutorial-3',
    title: '🏷️ Using Tags',
    content: 'Tags help you organize your notes. Add multiple tags to each note and use the tag filter above to find related notes quickly. Type new tags or select from existing ones when editing a note. Try creating a note with your own tags!',
    tags: ['tutorial'],
    createdAt: Date.now() - 2000,
    updatedAt: Date.now() - 2000,
    versions: []
  },
  {
    id: 'tutorial-4',
    title: '🎨 Customizing Your Theme',
    content: 'Click the palette icon in the top right to change the app\'s appearance. Choose from five beautiful themes and toggle dark mode for comfortable viewing in any lighting condition.',
    tags: ['tutorial'],
    createdAt: Date.now() - 3000,
    updatedAt: Date.now() - 3000,
    versions: []
  },
  {
    id: 'tutorial-5',
    title: '🔍 Searching Notes',
    content: 'Use the search bar at the top to find notes by title or content. Combine search with tag filtering to quickly find exactly what you\'re looking for. Try searching for "tutorial" to find these help notes again!',
    tags: ['tutorial'],
    createdAt: Date.now() - 4000,
    updatedAt: Date.now() - 4000,
    versions: []
  }
];

const getInitialState = (): NotesState => {
  const computeInitialTags = (notes: Note[]) => {
    return Array.from(new Set(notes.flatMap(note => 
      note.tags.map(tag => tag.trim().toLowerCase())
    )));
  };

  const migrateNote = (note: any): Note => {
    // Add versions array if it doesn't exist
    if (!Array.isArray(note.versions)) {
      note.versions = [];
    }
    return note;
  };

  if (typeof window === 'undefined') {
    return {
      notes: tutorialNotes.map(migrateNote),
      tags: computeInitialTags(tutorialNotes),
    };
  }

  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    const parsedData = JSON.parse(savedData);
    return {
      notes: parsedData.notes.map(migrateNote),
      tags: computeInitialTags(parsedData.notes),
    };
  }

  return {
    notes: tutorialNotes.map(migrateNote),
    tags: computeInitialTags(tutorialNotes),
  };
};

export const useNotes = () => {
  const [state, setState] = useState<NotesState>(getInitialState());
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const normalizeTag = (tag: string) => tag.trim().toLowerCase();

  const computeAllTags = (notes: Note[]) => {
    console.log(notes);
    return Array.from(new Set(notes.flatMap(note => 
      note.tags.map(normalizeTag)
    )));
  };

  const addNote = (title: string, content: string, tags: string[]) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      tags: tags.map(normalizeTag),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      versions: [], // Initialize empty versions array
    };

    setState(prev => {
      const updatedNotes = [newNote, ...prev.notes];
      const updatedTags = computeAllTags(updatedNotes);
      return {
        notes: updatedNotes,
        tags: updatedTags,
      };
    });
  };

  const updateNote = (id: string, title: string, content: string, tags: string[]) => {
    setState(prev => {
      const note = prev.notes.find(n => n.id === id);
      if (!note) return prev;

      // Create a new version from the current state
      const newVersion: NoteVersion = {
        title: note.title,
        content: note.content,
        tags: note.tags,
        updatedAt: note.updatedAt,
      };

      const updatedNotes = prev.notes.map(note =>
        note.id === id
          ? {
              ...note,
              title,
              content,
              tags: tags.map(normalizeTag),
              updatedAt: Date.now(),
              versions: [...note.versions || [], newVersion],
            }
          : note
      );
      const updatedTags = computeAllTags(updatedNotes);
      return {
        notes: updatedNotes,
        tags: updatedTags,
      };
    });
  };

  const deleteNote = (id: string) => {
    setState(prev => {
      const updatedNotes = prev.notes.filter(note => note.id !== id);
      const updatedTags = computeAllTags(updatedNotes);
      return {
        notes: updatedNotes,
        tags: updatedTags,
      };
    });
  };

  const filteredNotes = state.notes.filter(note => {
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => note.tags.includes(tag));
    
    const matchesSearch = searchQuery === '' ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTags && matchesSearch;
  });

  return {
    notes: filteredNotes,
    allNotes: state.notes,
    tags: state.tags,
    selectedTags,
    searchQuery,
    setSelectedTags,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
  };
};