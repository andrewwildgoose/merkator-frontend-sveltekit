<script>
    
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Card from "../lib/card.svelte";
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
    .homeFeed {
        height: 70vh;
        width: auto;
        display: flex;
        justify-content: space-between;
        overflow: hidden;
    }

    .feedContainer {
        display: flex;
        gap: 20px;
        min-width: 800px;
        overflow-x: auto;
        flex: 1;
    }

    .routeFeed,
    .tripFeed {
        flex: 1;
        min-width: 400px;
        overflow-y: auto;
    }
</style>
