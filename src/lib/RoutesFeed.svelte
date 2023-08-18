<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import PolyMap from './PolyMap.svelte';
    import { units, deleteRoute, userRoutes } from '../stores';
    import Card from './card.svelte';
    import UploadFile from './UploadFile.svelte';

    let routesStore;
    let token;
    let loading = true; // Added loading indicator

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

        try {
            // Fetch user's routes from the backend
            const response = await fetch('http://localhost:3000/merkator/user/routes', { headers });
            if (response.ok) {
                routesStore = await response.json();
                userRoutes.set(routesStore); // Update the store
            } else {
                // Handle error, e.g., unauthorized
                console.error('Failed to fetch user routes');
            }
        } finally {
            loading = false; // Set loading to false once data is fetched
        }
    });

    //handle click on the delete route button
    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this route?')) {
            const response = await deleteRoute(id, token);
            console.log(response);
        }
    };
</script>

<div class="routesListFeed">
    <h1>Routes</h1>
    <Card>
        <UploadFile />
    </Card>
    
    {#if loading}
        <p>Loading routes . . .</p> <!-- Show loading indicator -->
    {:else if routesStore !== undefined && routesStore.length > 0}
        {#each routesStore as route (route.id)}
            <div class='route-item'>
                <div class='map-container'>
                    <PolyMap routeGpxString={route.routeGpxString}/>
                </div>
                <div class='route-details'>
                    <h4>{route.routeName}</h4>
                    <p>
                        Distance: {route.routeLength} {$units}
                        <br>
                        Elevation Gain: {route.routeElevationGain} m
                        <br>
                        Elevation Loss: {route.routeElevationLoss} m
                        <br>
                        {#if route.routeDescription !== "Optional.empty"}{route.routeDescription}{/if}
                    </p>
                    <button on:click={() => handleDelete(route.id)}>delete route</button>
                </div>
            </div>
            <br>
        {/each}
    {:else}
        <p>There are no routes to show, upload a route!</p> <!-- Show message for no routes -->
    {/if}
</div>


<style>
    .routesListFeed {
        
        gap: 20px;
    }

    .route-item {
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

    .route-details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>