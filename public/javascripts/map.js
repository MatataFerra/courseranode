
mapboxgl.accessToken = 'pk.eyJ1IjoibWF0YXRhZmVycmEiLCJhIjoiY2tlbTczeWk3MGdoNDMybzV5OWY5MnlnNiJ9.__LvytlUJXXiZAxMt0pH9Q';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-58.3861497, -34.6012424], // starting position [lng, lat]
zoom: 13 // starting zoom
});



const bicisFetch = fetch("api/bicicletas")
.then(res => {
    
    return res.json();
})
.then(data=>{
    console.log(data)
    data.bicicletas.forEach(bici => {
        console.log(bici.ubicacion)
        new mapboxgl.Marker()
        .setLngLat(bici.ubicacion)
        .addTo(map)
    });
})
