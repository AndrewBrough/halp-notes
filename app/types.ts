export interface NoteVersion {
  title: string;
  content: string;
  tags: string[];
  updatedAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  versions: NoteVersion[];
}

export interface NotesState {
  notes: Note[];
  tags: string[];
}

export type ThemeOption = {
  name: string;
  value: string;
  colors: {
    light: {
      primary: string;
      secondary: string;
      background: string;
    };
    dark: {
      primary: string;
      secondary: string;
      background: string;
    };
  };
};