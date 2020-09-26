
mapboxgl.accessToken = 'pk.eyJ1IjoibWF0YXRhZmVycmEiLCJhIjoiY2tlbTczeWk3MGdoNDMybzV5OWY5MnlnNiJ9.__LvytlUJXXiZAxMt0pH9Q';
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/streets-v11',
center: [-58.3861497, -34.6012424], // starting position [lng, lat]
zoom: 13 // starting zoom
});

// var marker = new mapboxgl.Marker()
//     .setLngLat([-58.488043, -34.568419])
//     .addTo(map);

// var marker2 = new mapboxgl.Marker()
//     .setLngLat([-58.386149, -34.601242])
//     .addTo(map);

// var marker3 = new mapboxgl.Marker()
//     .setLngLat([-58.480828, -34.596932])
//     .addTo(map);

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
// $.ajax({
//     dataType: "json",
//     url: "api/bicicletas",
//     success: function(result) {
//         console.log(result);
//         result.bicicletas.forEach( bici => {
//             var marker = new mapboxgl.Marker()
//             .setLngLat([bici.ubicacion])
//             .addTo(map);
//         })
//     }
// })  PETICION A LA API y hacer un foreach para cada marcador