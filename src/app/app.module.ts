import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MyMapComponent } from './components/my-map/my-map.component';
import { GeoapifyGeocoderAutocompleteModule } from '@geoapify/angular-geocoder-autocomplete';
@NgModule({
  declarations: [
    AppComponent,
    MyMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GeoapifyGeocoderAutocompleteModule.withConfig('0c04a07dfc3e449c9b0d3967063aa889')
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
