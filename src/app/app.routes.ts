import { Routes } from '@angular/router';
import AuthSignUpComponent from './auth/features/auth-sign-up/auth-sign-up.component';
import AuthLogInComponent from './auth/features/auth-log-in/auth-log-in.component';
import { NoteListComponent } from './notes/features/note-list/note-list.component';
import { authGuard } from './shared/guards/auth.guard';
import { ChartComponent } from './components/chart/chart.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { MapComponent } from './components/map/map.component';

export const routes: Routes = [
  { path: 'sign-up', component: AuthSignUpComponent },
  { path: 'log-in', component: AuthLogInComponent },
  {
    path: 'note-list',
    canActivate: [authGuard],
    component: NoteListComponent,
  },
  { path: '', component: NoteListComponent },
  { path: 'chart', component: ChartComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'map', component: MapComponent },
];
