export const SHORTCUTS = {
  NEW_NOTE: {
    keys: ['Ctrl/Cmd', 'Shift', 'N'],
    description: 'Create new note'
  }
  // We can add more shortcuts here in the future
} as const;

// Helper to format the shortcut for display
export const formatShortcut = (keys: readonly string[]): string => {
  return keys.join(' + ');
}; 