import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from '../../shared/data-access/supabase.service';
import { NoteState } from '../../shared/interfaces/note-state';
import { AuthServiceService } from '../../auth/data-access/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private _supabaseClient = inject(SupabaseService).supabaseClient;
  private _authService = inject(AuthServiceService);

  private _state = signal<NoteState>({
    notes: [],
    loading: false,
    error: false,
  });

  notesLoaded = signal(false);

  //selectors

  notes = computed(() => this._state().notes);
  loading = computed(() => this._state().loading);
  error = computed(() => this._state().error);

  async getAllNotes() {
    try {
      this._state.update((state) => ({
        ...state,
        loading: true,
      }));
      const {
        data: { session },
      } = await this._authService.session();
      const { data } = await this._supabaseClient
        .from('notes')
        .select()
        .eq('user_id', session?.user.id);
      if (data && data.length > 0) {
        this._state.update((state) => ({
          ...state,
          notes: data,
        }));
      }
    } catch {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    } finally {
      this._state.update((state) => ({
        ...state,
        loading: false,
      }));
      this.notesLoaded.set(true);
    }
  }

  async insertNote(note: {
    title: string;
    description: null | string;
    destination: string;
    rating: number;
    coordinates: [string | null, string | null];
    start_date: string;
    end_date: string;
  }) {
    try {
      const {
        data: { session },
      } = await this._authService.session();
      const response = await this._supabaseClient.from('notes').insert({
        user_id: session?.user.id,
        title: note.title,
        description: note.description,
        destination: note.destination,
        rating: note.rating,
        coordinates: [note.coordinates[0], note.coordinates[1]],
        start_date: note.start_date,
        end_date: note.end_date,
      });
      console.log(response);
      this.getAllNotes();
    } catch (error) {
      console.log(error);
    }
  }

  async updateNote(note: {
    id: string;
    title: string;
    description: null | string;
    destination: string;
    rating: number;
    coordinates: [string | null, string | null];
    start_date: string;
    end_date: string;
  }) {
    try {
      const response = await this._supabaseClient
        .from('notes')
        .update({
          title: note.title,
          description: note.description,
          destination: note.destination,
          rating: note.rating,
          coordinates: [note.coordinates[0], note.coordinates[1]],
          start_date: note.start_date,
          end_date: note.end_date,
        })
        .eq('id', note.id);
      console.log(response);
      this.getAllNotes();
    } catch (error) {
      console.log(error);
    }
  }

  async deleteNote(id: string) {
    try {
      await this._supabaseClient.from('notes').delete().eq('id', id);
      this.getAllNotes();
    } catch {
      this._state.update((state) => ({
        ...state,
        error: true,
      }));
    }
  }
}
