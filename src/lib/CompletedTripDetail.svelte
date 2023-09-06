<script>
    import { onMount } from 'svelte';
    import LoadingIcon from './LoadingIcon.svelte';
    import {units} from '../stores';
    import TripMap from './TripMap.svelte';

    export let completedTripId;
    let token;
    let loading = true;
    let completedTrip;

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
    
    });

    const fetchCompletedTrip = async (headers, completedTripId) => {
        try {
            const response = await fetch(`http://localhost:3000/merkator/user/completed_trip/${completedTripId}`, {headers});
            if (response.ok) {
                completedTrip = await response.json();
                console.log("Completed trip fetched")
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
</script>

{#if loading}
    <div class="loading-container">
        <LoadingIcon />
        <p2>
            Loading completed trip . . . calculating calculations . . .
            <br><br>
            . . . this will take a minute.
        </p2>
    </div>
{:else}
<div class="full-detail">
    <div class="trip-detail">
        <h2>{completedTrip.tripName}</h2>
        <p2>{completedTrip.tripDescription}</p2>
        <div class="map">
            <TripMap 
            tripGpxStrings={completedTrip.tripGpxStrings} 
            tripRouteColours={completedTrip.tripRouteColours} />
        </div>
        <div class="basic-info">
            <p>
                Planned distance: {completedTrip.tripLength} {units}  |   
                Planned elevation gain: {completedTrip.tripElevationGain} m  |   
                Planned elevation loss: {completedTrip.tripElevationLoss} m  |   
                No. of routes planned : {completedTrip.routeCount}
            </p>
            <br>
            <p2>
                Completed distance: {completedTrip.tripCompletedLength} {units}  |   
                Completed elevation gain: {completedTrip.tripCompletedElevationGain} m  |   
                Completed elevation loss: {completedTrip.tripCompletedElevationLoss} m  |   
                No. of routes completed: {completedTrip.completedRouteCount}
            </p2>
            <br>
            <p2>
                Elapsed time: {completedTrip.tripElapsedTime}  |   
                Moving time: {completedTrip.tripMovingTime}  |   
                Average speed (elapsed time): {completedTrip.tripAvgSpeedElapsed} kph  |   
                Average speed (moving): {completedTrip.tripAvgSpeedMoving} kph  |   
            </p2>
            
        </div>

    </div>
    
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
    .basic-info,
    .map,
    .elev-chart {
        box-sizing: border-box;
        position: relative;
        width: 800px;
        margin: 0 auto;
    }
</style>