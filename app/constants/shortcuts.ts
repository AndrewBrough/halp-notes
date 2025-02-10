export const SHORTCUTS = {
  NEW_NOTE: {
    keys: ['N'],
    description: 'Create new note'
  },
  CLOSE_DIALOG: {
    keys: ['Esc'],
    description: 'Close note dialog'
  },
  SAVE_NOTE: {
    keys: ['Enter'],
    description: 'Save note while creating or editing'
  },
  EDIT_NOTE: {
    keys: ['E'],
    description: 'Edit hovered or tabbed over note'
  },
  DELETE_NOTE: {
    keys: ['D'],
    description: 'Delete hovered or tabbed over note'
  },
} as const;

// Helper to format the shortcut for display
export const formatShortcut = (keys: readonly string[]): string => {
  return keys.join(' + ');
}; 