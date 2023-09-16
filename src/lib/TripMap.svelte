<!-- Component to display interactive maps for planned and completed trips -->

<script>
    import { onMount } from 'svelte';
    import mapboxgl from "mapbox-gl";
    import startIcon from '$lib/assets/thick-green-loc-marker.svg';
    import finishIcon from '$lib/assets/flag-finish.svg';
    import currentIcon from '$lib/assets/current-location.svg';
    import "../../node_modules/mapbox-gl/dist/mapbox-gl.css";

    export let tripGpxStrings = [];
    export let tripRouteColours = [];
    export let plannedRoutes;
    export let length;
    let tripCoordinates = [];
    let mapContainer;
    let map;
    let start;
    let end;
    let currentMarkerCoords = null; 

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
                tripCoordinates = tripCoordinates.concat(coordinates);
                
                // Set the end location of the trip
                if (i === plannedRoutes-1) {
                    end = tripCoordinates[tripCoordinates.length - 1];
                }
                // Set the current location for a completed trip
                if (i > plannedRoutes) {
                    currentMarkerCoords = tripCoordinates[tripCoordinates.length - 1];
                }

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

                let rgbValues = tripRouteColours[i];
                const lineColor = `rgb(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]})`;

                if (i < plannedRoutes) {
                    // line style for planned routes
                    map.addLayer({
                        id: `route-${i}`,
                        type: 'line',
                        source: `route-${i}`,
                        paint: {
                            'line-color': lineColor,
                            'line-opacity': 0.7,
                            'line-width': 4,
                            'line-dasharray': [5,0.5]
                        }
                    });                    
                } else {
                    // line style for completed routes
                    map.addLayer({
                        id: `route-${i}`,
                        type: 'line',
                        source: `route-${i}`,
                        paint: {
                            'line-color': lineColor,
                            'line-opacity': 0.9,
                            'line-width': 7,
                        }
                    });
                }               
            }

            // Marker for start
            start = tripCoordinates[0];

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
            // If present, add the current marker layer for completed trips
            if (currentMarkerCoords !== null) {
                const currentImage = new Image();
                currentImage.src = currentIcon;
                
                currentImage.onload = () => {
                    map.addImage('current-marker', currentImage);
                    const currentMarker = {
                        type: 'Feature',
                        geometry: {
                            type: 'Point',
                            coordinates: [currentMarkerCoords[0], currentMarkerCoords[1]]
                        },
                    };
                    try {
                        map.addSource('current-marker-source', {
                            type: 'geojson',
                            data: currentMarker
                        });

                        map.addLayer({
                            id: 'current-marker',
                            type: 'symbol',
                            source: 'current-marker-source',
                            layout: {
                                'text-field': ['get', 'title'],
                                'text-anchor': 'bottom',
                                'text-offset': [0, -1.5],
                                'text-size': 14,
                                'icon-image': 'current-marker',
                                'icon-size': 0.3,
                                'icon-anchor': 'bottom',
                                'icon-offset': [0, 20]
                            },
                            paint: {
                                'text-color': '#26D696',
                            }
                        });
                    } catch (error) {
                        console.error('Error creating source or layer:', error);
                    };
                }
            }

            // Fit the map bounds to include all routes
            const bounds = new mapboxgl.LngLatBounds();
            
            for (const coord of tripCoordinates) {
                bounds.extend(coord);
            };


            // Calculate an appropriate zoom level based on the distance
            const maxZoom = Math.min(map.getMaxZoom(), Math.max(map.getZoom(), 20 - Math.log2(length) * 1.5));

            map.fitBounds(bounds, {
                padding: 50,
                maxZoom: maxZoom
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
        position: relative;
        width: 75vw;
        height: 40vh;
    }
    
    .map { 
        box-sizing: border-box;
        position: relative; 
        width: 100%;
        height: 100%;
    }

</style>