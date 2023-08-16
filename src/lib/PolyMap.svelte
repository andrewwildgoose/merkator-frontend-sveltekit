<script>
    import { onMount } from 'svelte';
    import mapboxgl from "mapbox-gl";
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";

    export let routeGpxString;

    let mapContainer;
    let map;

    onMount(() => {
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_API_ACCESS_TOKEN;

        map = new mapboxgl.Map({
            container: mapContainer,
            style: `mapbox://styles/merkator1/cllax8yio00sf01pdfsrn1gmo`,
            zoom: 9
        });

        // Parse JSON route data and create a GeoJSON feature for the polyline
        const routeData = JSON.parse(routeGpxString);
        const coordinates = routeData.trk.trkseg.trkpt.map(point => [point.lon, point.lat]);

        const geojson = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'LineString',
                coordinates: coordinates
            }
        };


        // Add the GeoJSON polyline layer to the map
        map.on('load', () => {

            map.addSource('route', {
                type: 'geojson',
                data: geojson
            });

            
            map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                paint: {
                    'line-color': '#26D696',
                    'line-width': 4
                }
            });        
            
            // Calculate the average coordinates to center the map
            const bounds = new mapboxgl.LngLatBounds(
                coordinates[0],
                coordinates[0]
            );
                
            // Extend the 'LngLatBounds' to include every coordinate in the bounds result.
            for (const coord of coordinates) {
                bounds.extend(coord);
            }
                
            map.fitBounds(bounds, {
                padding: 20
            });

        });
    });
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
