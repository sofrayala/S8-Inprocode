import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  inject,
  signal,
  effect,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { environment } from '../../../environments/environment.development';
import { NotesService } from '../../notes/data-access/notes.service';

const INITIAL_CENTER: [number, number] = [2.203, 41.3976];
const INITIAL_ZOOM = 2;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule, NavBarComponent],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnDestroy {
  private notesService = inject(NotesService);

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;
  map: any;
  private platformId = inject(PLATFORM_ID);
  latitude: (string | null)[] = [];
  longitude: (string | null)[] = [];
  destination: (string | null)[] = [];

  // Signals to track center and zoom
  center = signal<[number, number]>(INITIAL_CENTER);
  zoom = signal<number>(INITIAL_ZOOM);

  constructor() {
    this.notesService.getAllNotes();

    effect(() => {
      if (this.notesService.notesLoaded()) {
        const notes = this.notesService.notes();
        //coordinates info
        this.latitude = notes.map((note) =>
          note.coordinates ? note.coordinates[0] : '0'
        );
        this.longitude = notes.map((note) =>
          note.coordinates ? note.coordinates[1] : '0'
        );
        this.destination = notes.map((note) =>
          note.destination ? note.destination : 'no destination'
        );
        this.initMap();
      }
    });
  }

  async initMap() {
    console.log(this.latitude, this.longitude);
    if (isPlatformBrowser(this.platformId)) {
      // Dynamically import Mapbox GL JS with default export.
      const mapboxgl = (await import('mapbox-gl')).default;

      this.map = new mapboxgl.Map({
        accessToken: environment.MAP_BOX_TOKEN,
        container: this.mapContainer.nativeElement,
        center: this.center(),
        zoom: this.zoom(),
      });

      this.latitude.forEach((latitude, i) => {
        // popup
        const popup = new mapboxgl.Popup({
          className: 'popup',
        })
          .setHTML(`<p>${this.destination[i]}</p>`)
          .setMaxWidth('300px');

        // marker
        new mapboxgl.Marker({
          color: 'red',
        })
          .setLngLat([+this.longitude[i]!, +latitude!])
          .setPopup(popup)
          .addTo(this.map);
      });

      // GL JS's map.on('move') event listener to update signals
      this.map.on('move', () => {
        const newCenter = this.map.getCenter();
        this.center.set([newCenter.lng, newCenter.lat]);
        this.zoom.set(this.map.getZoom());
      });
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }
}
