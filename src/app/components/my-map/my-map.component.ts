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
      limit: 100,
    };
    
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.myAPIKey = "0c04a07dfc3e449c9b0d3967063aa889"; //should be stored in config file
    const mapStyle = "https://maps.geoapify.com/v1/styles/osm-carto/style.json";
    
    //probably want to save/fetch where user is based on last session.
     this.map = L.map('my-map').setView([48.096980, 11.555466], 15);//22.335594, 114.160622
    // );
    this.map.on('click', (e) => { 
      //have context menu showing ? or just create marker?
      var formpopup = L.popup();
      const markerIcon = L.icon({
        iconUrl: `https://api.geoapify.com/v1/icon?size=xx-large&type=awesome&color=%233e9cfe&icon=paw&apiKey=${this.myAPIKey}`,
        iconSize: [31, 46], // size of the icon
        iconAnchor: [e.latlng.lat, e.latlng.lng], // point of the icon which will correspond to marker's location
        popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
      });
      //need to modify popup so that we can delete this marker
      const zooMarkerPopup = L.popup().setContent(`"This is set at ${e.latlng.lat}, ${e.latlng.lng}`);
      const zooMarker = L.marker([e.latlng.lat, e.latlng.lng], {//22.335594, 114.160622
        icon: markerIcon
      }).bindPopup(zooMarkerPopup).addTo(this.map);
      //setup API call to save this coordinate marker
        
    });
    // the attribution is required for the Geoapify Free tariff plan
    this.map.attributionControl
      .setPrefix("")
      .addAttribution(
        'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>'
      );

    L.mapboxGL({
      style: `${mapStyle}?apiKey=${this.myAPIKey}`,
      accessToken: "no-token"
    }).addTo(this.map);

    const markerIcon = L.icon({
      iconUrl: `https://api.geoapify.com/v1/icon?size=xx-large&type=awesome&color=%233e9cfe&icon=paw&apiKey=${this.myAPIKey}`,
      iconSize: [31, 46], // size of the icon
      iconAnchor: [15.5, 42], // point of the icon which will correspond to marker's location
      popupAnchor: [0, -45] // point from which the popup should open relative to the iconAnchor
    });

    const zooMarkerPopup = L.popup().setContent("This is Munich Zoo");
    const zooMarker = L.marker([48.096980, 11.555466], {//22.335594, 114.160622
      icon: markerIcon
    }).bindPopup(zooMarkerPopup).addTo(this.map);

  }
  //map click
  onEachFeature = (feature, layer) => {
    //bind click
    layer.on({
        click: this.onMapClick(feature)
    });
  }
  onMapClick = async (event) => {
    var popup = L.popup()
    .setLatLng(event)
    .setContent('<p>Hello world!<br />This is a nice popup.</p>')
    .openOn(this.map);
  }
  //current location
  currentLocation = async () => {
    const response = await fetch(`https://api.geoapify.com/v1/ipinfo?ip=61.93.166.37&apiKey=${this.myAPIKey}`);
    const data = await response.json();     
    console.log(data); 
    this.setCoord(data.location.latitude, data.location.longitude);
  }
  //set coordinates
  setCoord = async (lat, lng) => {
    this.map.setView(new L.LatLng(lat, lng));
  }
  onSuggestionsChanged(suggestions: GeoJSON.Feature[]): void {
    // Handle the updated suggestions list
    console.log('Suggestions:', suggestions);
  }
  onPlaceSelected(place: any): void {
    // Handle the selected place, which is a GeoJSON feature
    console.log('Selected Place:', place);
    this.setCoord(place.geometry.coordinates[1], place.geometry.coordinates[0])
  }
}