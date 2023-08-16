<script>
    import { onMount } from 'svelte';
    import TripMap from './TripMap.svelte';
    import { units, deleteRoute } from '../stores';
    

    let tripsStore;
    let token;

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

        // Fetch user's routes from the backend
        const response = await fetch('http://localhost:3000/merkator/user/trips', { headers });
        if (response.ok) {
            tripsStore= await response.json();
            
        } else {
            // Handle error, e.g., unauthorized
            console.error('Failed to fetch user details');
        }
    });

    //TODO: update to deleteTrip()
    //handle click on the delete route button
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this trip?')) {
            const response = deleteRoute(id, token);
            console.log(response);
        }
    };
</script>

<div class="tripsListFeed">
    <h1>Trips</h1>
    
    {#if tripsStore !== undefined}
        {#each tripsStore as trip (trip.id)}
            <div class='trip-item'>
                <div class='map-container'>
                    <TripMap tripGpxStrings={trip.tripGpxStrings}/>
                </div>
                <div class='trip-details'>
                    <h4>{trip.tripName}</h4>
                    <p>
                        Distance: {trip.tripLength} {$units}
                        <br>
                        Elevation Gain: {trip.tripElevationGain}
                        <br>
                        Elevation Loss: {trip.tripElevationLoss}
                        <br>
                        {#if trip.tripDescription !== null}{trip.tripDescription}{/if}
                    </p>
                    <button on:click={() => handleDelete(trip.id)}>delete trip</button>
                </div>
            </div>
            <br>
        {/each}
        {:else}
            <p>There are no trips to show...</p>
    {/if}
</div>

<style>
    .tripsListFeed {
        
        gap: 20px;
    }

    .trip-item {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 10px;
        background: rgba(0, 0, 0, 0.1);
        padding: 20px;
        border-radius: 5px;
        box-shadow: 2px 4px 6px rgba(38, 214, 149, 0.192);
        margin: 20px;
    }

    .map-container {
        width: 160px;
        height: 160px; 
    }

    .trip-details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>