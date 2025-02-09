import { Note } from '../types';

const now = Date.now();

// Helper function to create version history
const createVersionHistory = (baseTitle: string, baseContent: string, count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    title: `${baseTitle} (Version ${count - i})`,
    content: `${baseContent} - Revision ${count - i}`,
    tags: ['tutorial'],
    updatedAt: now - ((i + 1) * 86400000) // Each version is one day older than the previous
  }));
};

export const tutorialNotes: Note[] = [
  {
    id: 'tutorial-1',
    title: '👋 Welcome to Halp Notes',
    content: 'Welcome! This is a simple note-taking app that helps you organize your thoughts. These tutorial notes will help you get started - you can delete them anytime using the trash icon.',
    tags: ['tutorial'],
    createdAt: now,
    updatedAt: now,
    versions: createVersionHistory(
      '👋 Welcome to Notes',
      'Welcome to our note-taking app! This simple tool will help you organize your thoughts.',
      10
    )
  },
  {
    id: 'tutorial-2',
    title: '✍️ Creating & Organizing',
    content: 'Click the + button to create a new note. Add tags to organize your notes and use the tag filter above to find them quickly. You can edit notes anytime by clicking the pencil icon.',
    tags: ['tutorial'],
    createdAt: now - 86400000, // One day ago
    updatedAt: now - 86400000,
    versions: createVersionHistory(
      '✍️ Creating Notes',
      'Learn how to create and organize your notes effectively with our simple tools.',
      10
    ).map(v => ({ ...v, updatedAt: v.updatedAt - 86400000 })) // Offset by one day
  },
  {
    id: 'tutorial-3',
    title: '🎨 Customize & Search',
    content: 'Use the palette icon to change themes and toggle dark mode. The search bar helps you find notes by title or content. Try searching for "tutorial" to find these notes again!',
    tags: ['tutorial'],
    createdAt: now - (86400000 * 2), // Two days ago
    updatedAt: now - (86400000 * 2),
    versions: createVersionHistory(
      '🎨 Customization Guide',
      'Discover how to personalize your note-taking experience with themes and search features.',
      10
    ).map(v => ({ ...v, updatedAt: v.updatedAt - (86400000 * 2) })) // Offset by two days
  }
]; 