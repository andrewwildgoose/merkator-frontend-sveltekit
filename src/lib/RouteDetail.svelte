<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { units, deleteRoute } from '../stores';
    import PolyMap from "./PolyMap.svelte";
    import ElevationChart from './ElevationChart.svelte';
    import { writable } from 'svelte/store';

    export let route;

    let token;
    let loading = true;
    let data;
    
    const elevationData = writable([]);
    const distanceMarkers = writable([]);
    
    onMount(async () => {
    token = localStorage.getItem('token');

    if (!token) {
        // Redirect to login if token is not present
        goto('/login');
        return;
    }

    const routeData = JSON.parse(route.routeGpxString);
    const elevPoints = routeData.trk.trkseg.trkpt.map(point => point.ele);
    const routeLengthObject = JSON.parse(route.routeLength);
    const routeLength = parseInt(routeLengthObject.value);

    elevationData.set(elevPoints);

    const numMarkers = elevPoints.length;
    const distMarkers = [];

    for (let i = 0; i < numMarkers; i++) {
        const markerPosition = (i / (numMarkers - 1)) * routeLength; // Calculate position in km
        distMarkers.push(markerPosition);
    }

    distanceMarkers.set(distMarkers);

    data = {
        labels: distMarkers.map(marker => `${marker.toFixed(2)} ${units}`),
        datasets: [
            {
                values: elevPoints,
            }
        ]
    };

    loading = false;
    });
    
    // const coordinates = routeData.trk.trkseg.trkpt.map(point => [point.lon, point.lat]);
    
    

    function generateDistanceMarkers(routeLength) {
        
        let distMarkers = [];
        let interval;

        if (routeLength < 50) {
            interval = 5; // Distance interval in kilometers for routes less than 50 km
        } else if (routeLength > 200) {
            interval = 20; // Distance interval in kilometers for routes more than 200 km
        } else {
            interval = 10; // Default distance interval in kilometers
        }

        for (let i = 0; i <= routeLength; i += interval) {
            distMarkers.push(i);
        }
        distMarkers = distMarkers.map(marker => `${marker} ${units}`)
        console.log("Distmarkers: ", distMarkers);

        return distMarkers;
    }


    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this route?')) {
            const response = await deleteRoute(id, token);
            console.log(response);
            if (response.ok) {
                handleSuccess(token)
            }
        }
    };
</script>

{#if loading}
    <p>Loading route details...</p>
{:else}
    <div class="route-detail">
        <h2>{route.routeName}</h2>
        <div class="map">
            <PolyMap routeGpxString={route.routeGpxString} />
        </div>
        <div class="basic-info">
            <p>
            Distance: {route.routeLength} {$units}  |  
            Elevation gain: {route.routeElevationGain} m  |  
            Elevation loss: {route.routeElevationLoss} m  
            {#if route.routeDescription !== "Optional.empty"}|  {route.routeDescription}{/if}
        </p>
        </div>
        
        <div class="elev-chart">
            <ElevationChart data={data}/>
        </div>
        
        
        <button on:click={() => handleDelete(route.idString)}>Delete route</button>
    </div>
{/if}

<style>
    .route-detail {
        position: relative;
        text-align: left;
        display: block;
        margin: 20px auto;
    }
    .basic-info,
    .map,
    .elev-chart {
        box-sizing: border-box;
        position: relative;
        width: 800px;
        margin: 0 auto;
    }
</style>