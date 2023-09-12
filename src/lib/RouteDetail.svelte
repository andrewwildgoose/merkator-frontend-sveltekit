<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { units, deleteRoute, rgbToHex } from '../stores';
    import PolyMap from "./PolyMap.svelte";
    import ElevationChart from './ElevationChart.svelte';

    export let route;

    let token;
    let loading = true;
    let data;
    let colors = [];
    
    onMount(async () => {
        token = localStorage.getItem('token');

        if (!token) {
            // Redirect to login if token is not present
            goto('/login');
            return;
        }

        // Elevation graph

        // Parse GPX data for elevation graph
        const routeData = JSON.parse(route.routeGpxString);
        const elevPoints = routeData.trk.trkseg.trkpt.map(point => point.ele);

        const numMarkers = elevPoints.length;
        const distMarkers = [];

        // Calculate position in distance for x axis
        for (let i = 0; i < numMarkers; i++) {
            const markerPosition = (i / (numMarkers - 1)) * route.routeLength; 
            distMarkers.push(markerPosition); 
        }

        // Dataset for elevation graph
        data = {
            labels: distMarkers.map(marker => `${marker.toFixed(2)} ${$units}`),
            datasets: [
                {
                    values: elevPoints,
                }
            ]
        };
        for ( let i= 0; i < 3; i++) {
                colors.push(rgbToHex(
                route.mapLineColor[0],
                route.mapLineColor[1],
                route.mapLineColor[2]
                )) 
        }

        loading = false;
    });

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
            <PolyMap routeGpxString={route.routeGpxString} color={colors[0]}/>
        </div>
        <div class="basic-info">
            <p>
            Distance: <p2>{route.routeLength} {$units}</p2>  |  
            Elevation gain: <p2>{route.routeElevationGain} m</p2>  |  
            Elevation loss: <p2>{route.routeElevationLoss} m</p2>  
            {#if route.routeDescription !== "Optional.empty"}|  {route.routeDescription}{/if}
        </p>
        </div>
        <div class="elev-chart">
            <h4>Elevation chart</h4>
            <ElevationChart data={data} colors={colors}/>
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
    .basic-info {
        text-align: center;
        padding: 10px;
    }
    
    .map {
        display: flex;
        flex-grow: 1;
        box-sizing: border-box;
        position: relative;
        width: 100%;
        margin: 0 auto;
    }
    .elev-chart {
        box-sizing: border-box;
        position: relative;
        width: 800px;
        margin: 0 auto;
    }
</style>