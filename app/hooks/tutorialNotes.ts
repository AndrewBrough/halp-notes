import { Note } from '../types';

const now = Date.now();

export const tutorialNotes: Note[] = [
  {
    id: 'tutorial-1',
    title: '👋 Welcome to Halp Notes',
    content: 'Welcome! This is a simple note-taking app that helps you organize your thoughts. These tutorial notes will help you get started - you can delete them anytime using the trash icon.',
    tags: ['tutorial'],
    createdAt: now,
    updatedAt: now,
    versions: []
  },
  {
    id: 'tutorial-2',
    title: '✍️ Creating & Organizing',
    content: 'Click the + button to create a new note. Add tags to organize your notes and use the tag filter above to find them quickly. You can edit notes anytime by clicking the pencil icon.',
    tags: ['tutorial'],
    createdAt: now - 1000,
    updatedAt: now - 1000,
    versions: []
  },
  {
    id: 'tutorial-3',
    title: '🎨 Customize & Search',
    content: 'Use the palette icon to change themes and toggle dark mode. The search bar helps you find notes by title or content. Try searching for "tutorial" to find these notes again!',
    tags: ['tutorial'],
    createdAt: now - 2000,
    updatedAt: now - 2000,
    versions: []
  }
]; 