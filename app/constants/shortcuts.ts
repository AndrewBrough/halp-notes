export const SHORTCUT_CATEGORIES = {
  'Site Navigation': {
    SEARCH: {
      keys: ['S'],
      description: 'Focus search box'
    },
    FILTER: {
      keys: ['F'],
      description: 'Focus tag filter'
    },
    OPEN_MENU: {
      keys: ['M'],
      description: 'Open main menu'
    },
    UNFOCUS: {
      keys: ['Esc'],
      description: 'Unfocus search or filter input'
    }
  },
  'Note Actions': {
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
    },
    SAVE_NOTE: {
      keys: ['Enter'],
      description: 'Save note while editing'
    },
    CLOSE_DIALOG: {
      keys: ['Esc'],
      description: 'Close note dialog'
    }
  }
} as const;

export type ShortcutCategories = typeof SHORTCUT_CATEGORIES;
export type ShortcutCategory = keyof ShortcutCategories;
export type Shortcuts = ShortcutCategories[ShortcutCategory][keyof ShortcutCategories[ShortcutCategory]];
export type ShortcutKey = keyof Shortcuts;

// Helper to format the shortcut for display
export const formatShortcut = (keys: readonly string[]): string => {
  return keys.join(' + ');
};

type ShortcutItem = {
  keys: readonly string[];
  description: string;
};

type FlattenedShortcuts = {
  [K in keyof (ShortcutCategories['Site Navigation'] & ShortcutCategories['Note Actions'])]: ShortcutItem;
};

export const SHORTCUTS = Object.values(SHORTCUT_CATEGORIES).reduce((acc, category) => ({
  ...acc,
  ...category
}), {}) as FlattenedShortcuts; 