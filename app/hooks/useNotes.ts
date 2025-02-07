'use client';

import { useState, useEffect } from 'react';
import { Note, NotesState } from '../types';

const STORAGE_KEY = 'notes-app-data';

const tutorialNotes: Note[] = [
  {
    id: 'tutorial-1',
    title: '👋 Welcome to Halp Notes!',
    content: 'Welcome to Halp Notes! This note and the following ones are tagged with "tutorial" to help you get started. You can filter them using the tags selector above. To remove these tutorial notes, simply delete them using the trash icon.',
    tags: ['tutorial', 'welcome'],
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: 'tutorial-2',
    title: '✍️ Creating and Editing Notes',
    content: 'To create a new note, click the + button in the bottom right corner. To edit an existing note, click the pencil icon on any note card. You can edit the title, content, and tags of your notes at any time.',
    tags: ['tutorial', 'basics'],
    createdAt: Date.now() - 1000,
    updatedAt: Date.now() - 1000
  },
  {
    id: 'tutorial-3',
    title: '🏷️ Using Tags',
    content: 'Tags help you organize your notes. Add multiple tags to each note and use the tag filter above to find related notes quickly. Type new tags or select from existing ones when editing a note. Try creating a note with your own tags!',
    tags: ['tutorial', 'tags'],
    createdAt: Date.now() - 2000,
    updatedAt: Date.now() - 2000
  },
  {
    id: 'tutorial-4',
    title: '🎨 Customizing Your Theme',
    content: 'Click the palette icon in the top right to change the app\'s appearance. Choose from five beautiful themes and toggle dark mode for comfortable viewing in any lighting condition.',
    tags: ['tutorial', 'customization'],
    createdAt: Date.now() - 3000,
    updatedAt: Date.now() - 3000
  },
  {
    id: 'tutorial-5',
    title: '🔍 Searching Notes',
    content: 'Use the search bar at the top to find notes by title or content. Combine search with tag filtering to quickly find exactly what you\'re looking for. Try searching for "tutorial" to find these help notes again!',
    tags: ['tutorial', 'search'],
    createdAt: Date.now() - 4000,
    updatedAt: Date.now() - 4000
  }
];

const initialState: NotesState = {
  notes: tutorialNotes,
  tags: [...new Set(tutorialNotes.flatMap(note => note.tags))],
};

export const useNotes = () => {
  const [state, setState] = useState<NotesState>(initialState);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      setState(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addNote = (title: string, content: string, tags: string[]) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      tags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const newTags = [...new Set([...state.tags, ...tags])];

    setState(prev => ({
      notes: [newNote, ...prev.notes],
      tags: newTags,
    }));
  };

  const updateNote = (id: string, title: string, content: string, tags: string[]) => {
    const newTags = [...new Set([...state.tags, ...tags])];

    setState(prev => ({
      notes: prev.notes.map(note =>
        note.id === id
          ? { ...note, title, content, tags, updatedAt: Date.now() }
          : note
      ),
      tags: newTags,
    }));
  };

  const deleteNote = (id: string) => {
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== id),
    }));
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