export const SHORTCUTS = {
  NEW_NOTE: {
    keys: ['N'],
    description: 'Create new note'
  },
  EDIT_NOTE: {
    keys: ['E'],
    description: 'Edit hovered note'
  },
  DELETE_NOTE: {
    keys: ['D'],
    description: 'Delete hovered note'
  }
} as const;

// Helper to format the shortcut for display
export const formatShortcut = (keys: readonly string[]): string => {
  return keys.join(' + ');
}; 