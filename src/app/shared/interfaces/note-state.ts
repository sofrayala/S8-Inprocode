import { Note } from '../../shared/interfaces/note';

export interface NoteState {
  notes: Note[];
  loading: boolean;
  error: boolean;
}
