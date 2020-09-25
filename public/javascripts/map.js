
mapboxgl.accessToken = 'pk.eyJ1IjoibWF0YXRhZmVycmEiLCJhIjoiY2tlbTczeWk3MGdoNDMybzV5OWY5MnlnNiJ9.__LvytlUJXXiZAxMt0pH9Q';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-58.488043, -34.568419], // starting position [lng, lat]
zoom: 13 // starting zoom
});