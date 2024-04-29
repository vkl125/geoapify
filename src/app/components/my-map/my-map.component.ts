import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { GeocoderAutocompleteOptions } from '@geoapify/geocoder-autocomplete';
import * as L from 'leaflet';
import 'mapbox-gl-leaflet';

@Component({
  selector: 'app-my-map',
  templateUrl: './my-map.component.html',
  styleUrls: ['./my-map.component.scss']
})
export class MyMapComponent implements OnInit, AfterViewInit {

  
  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement>;
  public myAPIKey: string;
  public displayValue: string;
  private map: L.Map;
  public options: GeocoderAutocompleteOptions;
  constructor(
  ) { 
    this.options = {
      // Add your options here
      type: 'street',
      lang: 'en',
      countryCodes: ['us', 'ca', 'hk'],
      position: { lat: 48.096980, lon: 11.555466 },
      limit: 10000,
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.myAPIKey = "0c04a07dfc3e449c9b0d3967063aa889"; //should be stored in config file
    const mapStyle = "https://maps.geoapify.com/v1/styles/osm-carto/style.json";
    
     const map = L.map('my-map').setView([48.096980, 11.555466], 15);//22.335594, 114.160622
    // const map = new L.Map(this.mapContainer.nativeElement).setView(
    //   [initialState.lat, initialState.lng],
    //   initialState.zoom
    // );

    // the attribution is required for the Geoapify Free tariff plan
    map.attributionControl
      .setPrefix("")
      .addAttribution(
        'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>'
      );

    L.mapboxGL({
      style: `${mapStyle}?apiKey=${this.myAPIKey}`,
      accessToken: "no-token"
    }).addTo(map);

    const markerIcon = L.icon({
      iconUrl: `https://api.geoapify.com/v1/icon?size=xx-large&type=awesome&color=%233e9cfe&icon=paw&apiKey=${this.myAPIKey}`,
      iconSize: [31, 46], // size of the icon
      iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
    });

    const zooMarkerPopup = L.popup().setContent("This is Munich Zoo");
    const zooMarker = L.marker([48.096980, 11.555466], {//22.335594, 114.160622
      icon: markerIcon
    }).bindPopup(zooMarkerPopup).addTo(map);

  }
  //current location
  currentLocation = async () => {
    const response = await fetch(`https://api.geoapify.com/v1/ipinfo?apiKey=${this.myAPIKey}`);
    const data = await response.json();      

  }
  onSuggestionsChanged(suggestions: GeoJSON.Feature[]): void {
    // Handle the updated suggestions list
    console.log('Suggestions:', suggestions);
  }
  onPlaceSelected(place: any): void {
    // Handle the selected place, which is a GeoJSON feature
    console.log('Selected Place:', place);
  }
}