<!-- Map component when displaying a single route -->

<script>
    import { onMount } from 'svelte';
    import mapboxgl from "mapbox-gl";
    import startIcon from '$lib/assets/thick-green-loc-marker.svg';
    import finishIcon from '$lib/assets/flag-finish.svg';
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";

    export let routeGpxString;
    export let color;

    let mapContainer;
    let map;
    let start;
    let end;

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
        start = coordinates[0];
        end = coordinates[coordinates.length - 1];
        
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

            map.flyTo({animate:false, essential: false})

            map.addSource('route', {
                type: 'geojson',
                data: geojson
            });

            
            map.addLayer({
                id: 'route',
                type: 'line',
                source: 'route',
                paint: {
                    'line-color': `${color}`,
                    'line-opacity': 0.7,
                    'line-width': 4,
                    'line-dasharray': [5,0.5]
                }
            });
            
            // Add start marker
            const startMarker = {
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [start[0], start[1]]
                },
            };

            // Load marker image and add it to Mapbox
            const startImage = new Image();
            startImage.src = startIcon;
            startImage.onload = () => {
                map.addImage('start-marker', startImage);

                // Add the source and layer
                try {
                    map.addSource('start-marker-source', {
                        type: 'geojson',
                        data: startMarker
                    });

                    map.addLayer({
                        id: 'start-marker',
                        type: 'symbol',
                        source: 'start-marker-source',
                        layout: {
                            'text-field': ['get', 'title'],
                            'text-anchor': 'bottom',
                            'text-offset': [0, -2],
                            'text-size': 14,
                            'icon-image': 'start-marker',
                            'icon-size': 0.4,
                            'icon-anchor': 'bottom',
                            'icon-offset': [0, 20]
                        },
                        paint: {
                            'text-color': '#26D696',
                        }
                    });
                } catch (error) {
                console.error('Error creating source or layer:', error);
                }
            };
            
            // Add the end marker layer
            const finishImage = new Image();
            finishImage.src = finishIcon;
            console.log(end);
            finishImage.onload = () => {
                map.addImage('finish-marker', finishImage);
                const endMarker = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: [end[0], end[1]]
                    },
                };
                try {
                    map.addSource('end-marker-source', {
                        type: 'geojson',
                        data: endMarker
                    });

                    map.addLayer({
                        id: 'end-marker',
                        type: 'symbol',
                        source: 'end-marker-source',
                        layout: {
                            'text-field': ['get', 'title'],
                            'text-anchor': 'bottom',
                            'text-offset': [0.5, -1.5],
                            'text-size': 14,
                            'icon-image': 'finish-marker',
                            'icon-size': 0.3,
                            'icon-anchor': 'bottom',
                            'icon-offset': [15, 20]
                        },
                        paint: {
                            'text-color': '#26D696',
                        }
                    });
                    } catch (error) {
                    console.error('Error creating source or layer:', error);
                };
            }
            
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
                padding: 50
            });

        });
    });
</script>

<main>
    <div>
        <div class="map-box">
            <div class="map" bind:this={mapContainer}/>
        </div>
    </div>
</main>

<style>
    .map-box {
        box-sizing: border-box;
        position: relative;
        width: 800px;
        height: 300px;
    }
    
    .map { 
        box-sizing: border-box;
        position: relative; 
        width: 100%;
        height: 100%;
    }
</style>
