<script>
    
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Card from "../lib/card.svelte";
    import NavBar from "../lib/navBar.svelte";
    import RoutesFeed from "../lib/RoutesFeed.svelte";
    import TripsFeed from "../lib/TripsFeed.svelte";
    import { userRoutes, userTrips } from '../stores';
    import AddRouteToTrip from '../lib/AddRouteToTrip.svelte';

    let userDetails = null; // Store fetched user details

    onMount(async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            // Redirect to login if token is not present
            goto('/auth/login');
            return;
        }
        
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        
        // Fetch user details from the backend
        const response = await fetch('http://localhost:3000/merkator/user/details', { headers });
        
        if (response.status === 403) {
                // Redirect to login if 403 Forbidden is received
                goto('/auth/login');
                return;
            }

        if (response.ok) {
            userDetails = await response.json();
        } else {
            // Handle error, e.g., unauthorized
            console.error('Failed to fetch user details');
        }
    });

</script>

<div class="home">
    {#if userDetails}
    <div>
        <h1>Welcome, {userDetails.name}!</h1>
    </div>
    {:else}
    <div>
        <h1>User details not found</h1>

    </div>
    {/if}
    
    <NavBar />
    
</div>

<div class="homeFeed">

    <div class="routeFeed">
        <Card>
            <RoutesFeed />
        </Card>
    </div>

    <div class="tripFeed">
        <Card>
            <TripsFeed />
        </Card>
    </div>

    <div class="tripFeed">
        <Card>
            <AddRouteToTrip {userRoutes} {userTrips}/>
        </Card>
    </div>
</div>



<style>
    .home {
        text-align: center;
        display: block;
        margin: 20px auto;
    }
    .homeFeed {
        text-align: center;
        
    }
</style>
