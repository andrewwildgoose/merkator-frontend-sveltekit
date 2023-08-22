<script>
    
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Card from "../lib/card.svelte";
    import NavBar from "../lib/navBar.svelte";
    import RoutesFeed from "../lib/RoutesFeed.svelte";
    import TripsFeed from "../lib/TripsFeed.svelte";

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
        <p>Welcome, {userDetails.name}!</p>
    </div>
    {:else}
    <div>
        <p>User details not found</p>

    </div>
    {/if}
    
    <NavBar />
    
</div>

<div class="homeFeed">
    <div class="feedContainer">
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
    </div>
</div>



<style>
    .home {
        text-align: center;
        display: block;
        margin: 20px auto;
    }
    .homeFeed {
        height: 70vh;
        display: flex;
        justify-content: space-between;
        overflow: hidden; /* Hide overflow to prevent scrollbars at the container level */
    }

    .feedContainer {
        display: flex;
        gap: 20px; /* Adjust the gap as needed */
        overflow-x: auto; /* Enable horizontal scrolling */
        flex: 1; /* Allow the container to grow and take up available space */
    }

    .routeFeed,
    .tripFeed {
        flex: 1; /* Allow the feeds to take up equal available space */
        max-width: 45%; /* Adjust the width as needed */
        overflow-y: auto; /* Enable vertical scrolling for each feed */
    }
</style>
