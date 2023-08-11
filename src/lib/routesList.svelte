<script>
    
    import { units } from '../stores';
    import { onMount } from 'svelte';
    

    //store the routes to display for the user
    let routesStore;

    onMount(async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            // Redirect to login if token is not present
            goto('/login');
            return;
        }
        
        const headers = {
            'Authorization': `Bearer ${token}`
            
        };

        // Fetch user's routes from the backend
        const response = await fetch('http://localhost:3000/merkator/user/routes', { headers });
        if (response.ok) {
            routesStore = await response.json();
            console.log(routesStore);
            
        } else {
            // Handle error, e.g., unauthorized
            console.error('Failed to fetch user details');
        }
    });

    //handle click on the delete route button
    const handleClick = (id) => {
        routesStore.update(routes => routes.filter(route => route.id != id));
        console.log(id);
    };

</script>

<div class="routesListFeed">
    
    <h1>Routes</h1>
    
    {#if routesStore !== undefined}
        {#each routesStore as route (route.id)}
            <div class='centre'>
                <h4>{route.routeName}</h4>
                <p>Distance: {route.routeLength} {$units}
                    <br>
                    Elevation Gain: {route.routeElevationGain}
                    <br>
                    Elevation Loss: {route.routeElevationLoss}
                    {#if route.routeDescription !="Optional.empty"}{route.routeDescription}{/if}
                </p>
                <button on:click={() => handleClick(route.id)}>delete route</button>
            </div>
            <br>
        {/each}
        {:else}
            <p>There are no routes to show...</p>
    {/if}
</div>

<style>
    .routesListFeed {
        text-align: center;
    }
    .centre {
        text-align: center;
        border-radius: 2px;
        border: 2px solid rgba(38, 214, 150, 0.1);
        margin: auto;
        width: 50%;
        padding: 10px;
    }
</style>


