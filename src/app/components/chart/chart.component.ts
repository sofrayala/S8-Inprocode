// import { Component } from '@angular/core';
// import { NavBarComponent } from '../nav-bar/nav-bar.component';
// import { BaseChartDirective } from 'ng2-charts';
// import { ChartType, ChartData } from 'chart.js';

// @Component({
//   selector: 'app-chart',
//   imports: [NavBarComponent, BaseChartDirective],
//   templateUrl: './chart.component.html',
//   styleUrl: './chart.component.css',
// })
// export class ChartComponent {
//   chartType: ChartType = 'bar';
//   chartData: ChartData<'bar'> = {
//     labels: ['A', 'B', 'C'],
//     datasets: [{ label: 'Test', data: [10, 20, 30] }],
//   };
// }
import { Component, inject, effect } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartData } from 'chart.js';
import { ChartOptions } from 'chart.js';
import { NotesService } from '../../notes/data-access/notes.service';

@Component({
  selector: 'app-chart',
  imports: [BaseChartDirective, NavBarComponent],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent {
  private notesService = inject(NotesService);

  colors = [
    '#034159',
    '#03658C',
    '#63BBF2',
    '#63D8F2',
    '#305912',
    '#A1A60A',
    '#F2785C',
  ];

  //bar

  chartType: ChartType = 'bar';
  chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Visited countries rating',
        data: [],
        backgroundColor: this.colors,
      },
    ],
  };

  //sparkline
  sparklineType: ChartType = 'line';
  sparklineData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'Rating Sparkline',
        data: [],
        borderColor: 'forestgreen',
        backgroundColor: 'rgba(34,139,34,0.2)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };
  sparklineOptions: ChartOptions<'line'> = {
    plugins: { legend: { display: false } },
    elements: { line: { borderWidth: 2 } },
    scales: { x: { display: false }, y: { display: false } },
  };

  //pie chart
  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [
      {
        label: 'Ratings',
        data: [],
        backgroundColor: this.colors,
      },
    ],
  };
  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  //dougnut
  doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        label: 'Ratings',
        data: [],
        backgroundColor: this.colors,
      },
    ],
  };
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { display: true },
    },
  };

  constructor() {
    this.notesService.getAllNotes();

    effect(() => {
      if (this.notesService.notesLoaded()) {
        const notes = this.notesService.notes();
        //bar info
        const destinations = notes.map((note) => note.destination);
        const ratings = notes.map((note) => note.rating);

        this.chartData.labels = destinations;
        this.chartData.datasets[0].data = ratings;

        // Sparkline info
        this.sparklineData.labels = destinations;
        this.sparklineData.datasets[0].data = ratings;

        //pie info
        this.pieChartData.labels = destinations;
        this.pieChartData.datasets[0].data = ratings;

        //doughnut
        this.doughnutChartData.labels = destinations;
        this.doughnutChartData.datasets[0].data = ratings;
      }
    });
  }
}
