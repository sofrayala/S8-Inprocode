import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { NotesService } from '../../notes/data-access/notes.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, NavBarComponent, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent {
  private notesService = inject(NotesService);

  selectedEvent: any = null;
  editForm = {
    destination: '',
    start_date: '',
    end_date: '',
  };

  a = false;
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    dateClick: (arg) => this.handleDateClick(arg),
    events: [],
    eventClick: (arg) => this.openEditModal(arg.event),
  };

  constructor() {
    this.notesService.getAllNotes();

    effect(() => {
      if (this.notesService.notesLoaded()) {
        const notes = this.notesService.notes();
        const colors = [
          '#034159',
          '#03658C',
          '#63BBF2',
          '#63D8F2',
          '#305912',
          '#A1A60A',
          '#F2785C',
        ];

        const events: EventInput[] = notes.map((note, i) => ({
          title: note.destination,
          start: note.start_date,
          end: note.end_date,
          color: colors[i % colors.length],
        }));
        this.calendarOptions = {
          ...this.calendarOptions,
          events,
        };
      }
    });
  }

  handleDateClick(arg: any) {
    this.selectedEvent = null;
    this.editForm = {
      destination: '',
      start_date: arg.dateStr, // Pre-fill with clicked date
      end_date: arg.dateStr,
    };
    this.a = true;
  }

  handleCloseBtn() {
    this.a = false;
  }
  openEditModal(event: any) {
    this.selectedEvent = event;
    this.editForm = {
      destination: event.title,
      start_date: event.startStr,
      end_date: event.endStr,
    };
    this.a = true;
  }

  async submitEdit() {
    if (
      !this.editForm.destination ||
      !this.editForm.start_date ||
      !this.editForm.end_date
    )
      return;

    if (!this.selectedEvent) {
      await this.notesService.insertNote({
        title: this.editForm.destination,
        description: '',
        destination: this.editForm.destination,
        rating: 1,
        coordinates: [null, null],
        start_date: this.editForm.start_date,
        end_date: this.editForm.end_date,
      });
      this.notesService.getAllNotes();
    } else {
      const notes = this.notesService.notes();
      const note = notes.find(
        (n) =>
          n.destination === this.selectedEvent.title &&
          n.start_date === this.selectedEvent.startStr &&
          n.end_date === this.selectedEvent.endStr
      );
      if (note) {
        await this.notesService.updateNote({
          ...note,
          destination: this.editForm.destination,
          start_date: this.editForm.start_date,
          end_date: this.editForm.end_date,
        });
        this.notesService.getAllNotes();
      }
    }
    this.a = false;
  }
}
