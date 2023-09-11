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

    .basic-info{
        text-align: center;
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