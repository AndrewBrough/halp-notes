import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note, NotesState } from '../types';
import { tutorialNotes } from '../defaultNotes/tutorialNotes';
import { foodNotes } from '../defaultNotes/foodNotes';

interface NotesContextType {
  notes: Note[];
  tags: string[];
  selectedTags: string[];
  searchQuery: string;
  setSelectedTags: (tags: string[]) => void;
  setSearchQuery: (query: string) => void;
  addNote: (title: string, content: string, tags: string[]) => void;
  updateNote: (id: string, title: string, content: string, tags: string[]) => void;
  deleteNote: (id: string) => void;
  restoreTutorialNotes: () => void;
}

const NotesContext = createContext<NotesContextType | null>(null);

export const STORAGE_KEY = 'notes-app-data';

export function NotesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NotesState>(() => {
    if (typeof window === 'undefined') {
      return {
        notes: tutorialNotes,
        tags: computeInitialTags(tutorialNotes),
      };
    }

    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      return {
        notes: parsedData.notes,
        tags: computeInitialTags(parsedData.notes),
      };
    }

    // If no saved data exists, load default tutorial and food notes
    const defaultNotes = [...tutorialNotes, ...foodNotes];
    return {
      notes: defaultNotes,
      tags: computeInitialTags(defaultNotes),
    };
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Move all the note manipulation functions here
  const addNote = (title: string, content: string, tags: string[]) => {
    const newNote: Note = {
      id: Date.now().toString(),
      title,
      content,
      tags: tags.map(normalizeTag),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      versions: [],
    };

    setState(prev => ({
      notes: [newNote, ...prev.notes],
      tags: computeAllTags([newNote, ...prev.notes]),
    }));
  };

  const updateNote = (id: string, title: string, content: string, tags: string[]) => {
    setState(prev => {
      const note = prev.notes.find(n => n.id === id);
      if (!note) return prev;

      const newVersion = {
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
      return {
        notes: updatedNotes,
        tags: computeAllTags(updatedNotes),
      };
    });
  };

  const deleteNote = (id: string) => {
    setState(prev => {
      const updatedNotes = prev.notes.filter(note => note.id !== id);
      return {
        notes: updatedNotes,
        tags: computeAllTags(updatedNotes),
      };
    });
  };

  const restoreTutorialNotes = () => {
    setState(prev => {
      const nonTutorialNotes = prev.notes.filter(note => !note.tags.includes('tutorial'));
      const updatedNotes = [...tutorialNotes, ...nonTutorialNotes];
      return {
        notes: updatedNotes,
        tags: computeAllTags(updatedNotes),
      };
    });
  };

  const filterNotes = (notes: Note[], query: string, selectedTags: string[]) => {
    return notes.filter((note) => {
      const matchesSearch = query === '' || 
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase()) ||
        note.versions.some(version => 
          version.title.toLowerCase().includes(query.toLowerCase()) ||
          version.content.toLowerCase().includes(query.toLowerCase())
        );

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => note.tags.includes(tag));

      return matchesSearch && matchesTags;
    });
  };

  const filteredNotes = filterNotes(state.notes, searchQuery, selectedTags);

  return (
    <NotesContext.Provider value={{
      notes: filteredNotes,
      tags: state.tags,
      selectedTags,
      searchQuery,
      setSelectedTags,
      setSearchQuery,
      addNote,
      updateNote,
      deleteNote,
      restoreTutorialNotes,
    }}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}

// Helper functions
function normalizeTag(tag: string) {
  return tag.trim().toLowerCase();
}

function computeInitialTags(notes: Note[]) {
  return Array.from(new Set(notes.flatMap(note => 
    note.tags.map(tag => tag.trim().toLowerCase())
  ))).sort();
}

function computeAllTags(notes: Note[]) {
  return Array.from(new Set(notes.flatMap(note => 
    note.tags.map(normalizeTag)
  ))).sort();
} 