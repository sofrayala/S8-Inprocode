import { FormControl } from '@angular/forms';

export interface NoteForm {
  title: FormControl<string | null>;
  description: FormControl<string | null>;
  destination: FormControl<string | null>;
  rating: FormControl<number | null>;
  latitud: FormControl<string | null>;
  longitud: FormControl<string | null>;
  start_date: FormControl<string | null>;
  end_date: FormControl<string | null>;
}
