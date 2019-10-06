import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FlightSearchComponent } from './components/flight-search/flight-search.component';


const routes: Routes = [
  { path: '', redirectTo: 'flightsearch', pathMatch: 'full' },
  { path: 'flightsearch', component: FlightSearchComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
