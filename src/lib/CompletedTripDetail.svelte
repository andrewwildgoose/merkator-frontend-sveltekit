<script>
    import { onMount } from 'svelte';
    import LoadingIcon from './LoadingIcon.svelte';
    import {units, rgbToHex, deleteCompletedTrip} from '../stores';
    import TripMap from './TripMap.svelte';
    import ElevationChart from './ElevationChart.svelte';

    export let completedTripId;
    let token;
    let loading = true;
    let completedTrip;
    let tripElevData = [];
    let datasets = [];
    let data;
    let numMarkers = 0;
    let colors = [];

    onMount(async () => {
        token = localStorage.getItem('token');
        
        if (!token) {
            // Redirect to login if token is not present
            goto('/login');
            return;
        }

        const headers = {
            'Authorization': `Bearer ${token}`
        };

        fetchCompletedTrip(headers, completedTripId);

        // Elevation graph data building
        // Adds a number of null values to the start of each set of data 
        // to ensure correct starting position on the graph 
        for (const route of completedTrip.tripGpxStrings) {
            const routeData = JSON.parse(route);
            let elevPoints = [];
            for (let i = 0; i < numMarkers; i++) {
                elevPoints.push(null);
            }
            const elevData = routeData.trk.trkseg.trkpt.map(point => point.ele)
            elevPoints = elevPoints.concat(elevData);

            tripElevData.push(elevPoints);
            numMarkers += elevData.length;
        }

        // Add a number of null values to the end of each dataset to ensure graph displays correctly
        for (const elevPoints of tripElevData){
            const postDataMarkers = numMarkers - elevPoints.length;
            for (let i = 0; i< postDataMarkers; i++) {
                elevPoints.push(null);
            } 
        }

        // Calculate position in distance for x axis
        const distMarkers = [];

        for (let i = 0; i < numMarkers; i++) {
            const markerPosition = (i / (numMarkers - 1)) * trip.tripLength; 
            distMarkers.push(markerPosition); 
        }

        for (let i = 0; i < tripElevData.length; i++) {
            const routeElevPoints = tripElevData[i];
            const dataset = {
                name: `${tripRoutes[i].routeName}`,
                values: routeElevPoints,
            };
            datasets.push(dataset);
            colors.push(rgbToHex(
                    trip.tripRouteColours[i][0],
                    trip.tripRouteColours[i][1],
                    trip.tripRouteColours[i][2]
                    ))
        }

        // Dataset for elevation graph
        data = {
            labels: distMarkers.map(marker => `${marker.toFixed(2)} ${$units}`),
            datasets: datasets,
        };
    
    });

    const fetchCompletedTrip = async (headers, completedTripId) => {
        try {
            const response = await fetch(`http://localhost:3000/merkator/user/completed_trip/${completedTripId}`, {headers});
            if (response.ok) {
                completedTrip = await response.json();
                console.log("Completed trip fetched")
                console.log("Combined GPX Strings:")
                console.log(completedTrip.tripGpxStrings.concat(completedTrip.tripCompletedGpxStrings))
                console.log("Combined Colours:")
                console.log(completedTrip.tripRouteColours.concat(completedTrip.tripCompletedRouteColours))
            } else {
                console.log("Error fetching trip")
                errorMessage = "Error fetching trip"
            }
        } catch (error) {
            errorMessage = "An error occurred while fetching the trip.";
        }
        finally {
            loading = false;
        }

    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this trip?')) {
            const response = await deleteCompletedTrip(id, token);
            console.log(response);
            if (response.ok) {
                handleSuccess(token)
            }
        }
    };
</script>

{#if loading}
    <div class="loading-container">
        <LoadingIcon />
        <p2>
            Loading completed trip . . .
            <br><br>
            . . . this will take a minute.
        </p2>
    </div>
{:else}
<div class="full-detail">
    <div class="trip-detail">
        <h2>{completedTrip.tripName}</h2>
        <p2>{completedTrip.tripDescription}</p2>
        <br>
        <div class="map">
            <TripMap 
            tripGpxStrings={completedTrip.tripGpxStrings.concat(completedTrip.tripCompletedGpxStrings)} 
            tripRouteColours={completedTrip.tripRouteColours.concat(completedTrip.tripCompletedRouteColours)}
            plannedRoutes={completedTrip.routeCount} 
            length={completedTrip.tripLength}/>
        </div>
        <div class="basic-info">
            <p>
                Planned distance: <p2>{completedTrip.tripLength} {$units}</p2> |   
                No. of routes planned : <p2>{completedTrip.routeCount}</p2>
                <br>
                Planned elevation gain: <p2>{completedTrip.tripElevationGain} m</p2>  |   
                Planned elevation loss: <p2>{completedTrip.tripElevationLoss} m</p2>
            </p>
            <p>
                Completed distance: <p2>{completedTrip.tripCompletedLength} {$units}</p2>  |   
                No. of routes completed: <p2>{completedTrip.completedRouteCount}</p2>
                <br>
                Completed elevation gain: <p2>{completedTrip.tripCompletedElevationGain} m</p2>  |   
                Completed elevation loss: <p2>{completedTrip.tripCompletedElevationLoss} m</p2>
                
            </p>
            <p>
                Elapsed time: <p2>{completedTrip.tripElapsedTime}</p2>  |   
                Moving time: <p2>{completedTrip.tripMovingTime}</p2>
                <br> 
                Average speed (elapsed time): <p2>{completedTrip.tripAvgSpeedElapsed} kph</p2>  |   
                Average speed (moving): <p2>{completedTrip.tripAvgSpeedMoving} kph</p2>  
            </p>
        </div>
        <div class="elev-chart">
            <h4>Elevation chart</h4>
            <ElevationChart data={data} colors={colors}/>
        </div>
    </div>
    <button on:click={() => handleDelete(completedTrip.idString)}>Delete trip</button>
</div>
{/if}

<style>
    .full-detail {
        display: flex;
        height: 70vh;
    }
    .trip-detail {
        position: relative;
        flex-grow: 1;
        text-align: left;
        display: block;
        margin: 20px auto;
        padding: 10px;
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