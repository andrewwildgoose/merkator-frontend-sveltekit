<script>
    import { onMount } from 'svelte';
    import mapboxgl from "mapbox-gl";
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";

    export let tripGpxStrings = [];
    let tripCoordinates = []; // Initialize an array to store all coordinates
    let mapContainer;
    let map;

    onMount(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;

        map = new mapboxgl.Map({
            container: mapContainer,
            style: `mapbox://styles/merkator1/cllax8yio00sf01pdfsrn1gmo`,
            zoom: 9
        });

        // Add the GeoJSON polyline layers for each route to the map
        map.on('load', () => {
            
            for (let i = 0; i < tripGpxStrings.length; i++) {
                const routeData = JSON.parse(tripGpxStrings[i]);
                const coordinates = routeData.trk.trkseg.trkpt.map(point => [point.lon, point.lat]);
                tripCoordinates = tripCoordinates.concat(coordinates); // Concatenate coordinates to the tripCoordinates array

                const geojson = {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: coordinates
                    }
                };

                map.addSource(`route-${i}`, {
                    type: 'geojson',
                    data: geojson
                });

                map.addLayer({
                    id: `route-${i}`,
                    type: 'line',
                    source: `route-${i}`,
                    paint: {
                        'line-color': getRandomColor(),
                        'line-width': 4
                    }
                });
            }

            
            // Fit the map bounds to include all routes
            const bounds = new mapboxgl.LngLatBounds();
            
            for (const coord of tripCoordinates) {
                bounds.extend(coord);
            }

            // Calculate distance between start and end points
            const start = tripCoordinates[0];
            const end = tripCoordinates[tripCoordinates.length - 1];
            const distance = Math.sqrt((end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2);

            // Calculate an appropriate zoom level based on the distance
            const maxZoom = Math.min(map.getMaxZoom(), Math.max(map.getZoom(), 20 - Math.log2(distance) * 1));

            map.fitBounds(bounds, {
                padding: 20,
                maxZoom: maxZoom
            });
        });
    });

    // generate a random hex value for colour
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
</script>

<main>
    <div>
        <div class="map-box">
            <div class="map" bind:this={mapContainer} />
        </div>
    </div>
</main>

<style>
    .map-box {
        box-sizing: border-box;
        position: absolute;
        width: 150px;
        height: 150px;
    }

    .map { 
        box-sizing: border-box;
        position: absolute; 
        width: 100%;
        height: 100%;
    }
</style>