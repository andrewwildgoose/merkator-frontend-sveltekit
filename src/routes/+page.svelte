<script>
    
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import Card from "../lib/card.svelte";
    import RoutesFeed from "../lib/RoutesFeed.svelte";
    import TripsFeed from "../lib/TripsFeed.svelte";
    import CompletedTripsFeed from "../lib/CompletedTripsFeed.svelte"


    let userDetails = null; // Store fetched user details
    let feedSelected = false;
    let showHomeFeed = false;
    let showPlannedFeed = false;
    let showCompletedFeed = false;

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
        const response = await fetch(`http://${import.meta.env.VITE_VM_IP}:3000/merkator/user/details`, { headers });
        
        if (response.status === 403) {
                // Redirect to login if 403 Forbidden is received
                goto('/auth/login');
                return;
            }

        if (response.ok) {
            userDetails = await response.json();
        } else {
            console.error('Failed to fetch user details');
        }
    });

    const showPlanned = () => {
        showHomeFeed = true;
        feedSelected = true;
        showPlannedFeed = true;
        showCompletedFeed = false;
    };

    const showCompleted = () => {
        showHomeFeed = true;
        feedSelected = true;
        showCompletedFeed = true;
        showPlannedFeed = false;
    }

</script>

<div class="parent-container">
    {#if !feedSelected}
    <div class="selector-container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="feed-selector" on:click={showPlanned}>
            <h1>Plan</h1>
            <br>
            <p>View your planned routes and trips</p> 
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="feed-selector" on:click={showCompleted}>
            <h1>Complete</h1>
            <br>
            <p>View your completed trips</p> 
        </div>        
    </div>
    {/if}
    {#if showHomeFeed}
    {#if showPlannedFeed}
    <div class="small-selector-container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="small-feed-selector-current" on:click={showPlanned}>
            <h2>Plan</h2>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="small-feed-selector" on:click={showCompleted}>
            <h2>Complete</h2>
        </div>        
    </div>
    {:else if showCompletedFeed}
    <div class="small-selector-container">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="small-feed-selector" on:click={showPlanned}>
            <h2>Plan</h2>
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="small-feed-selector-current" on:click={showCompleted}>
            <h2>Complete</h2>
        </div>        
    </div>
    {/if}
    <div class="home-feed">
        <div class="feed-container">
            {#if showPlannedFeed}
                <div class="route-feed">
                    <Card>
                        <RoutesFeed />
                    </Card>
                </div>
                <div class="trip-feed">
                    <Card>
                        <TripsFeed />
                    </Card>
                </div>
            {:else if showCompletedFeed}
                <div class="comp-trip-feed">
                    <Card>
                        <CompletedTripsFeed />
                    </Card>
                </div>
            {/if}
        </div>
    </div>
    {/if}
    
</div>



<style>
    .parent-container {
        height: 80vh;
        width: 100%;
    }

    .selector-container {
        display: flex;
        justify-content: center;
        height: 80vh;
        width: 100%;
        padding-top: 30px;
        text-align: center;
    }

    .small-selector-container {
        display: flex;
        justify-content: center;
        height: 10%;
        width: 100%;
    }

    .feed-selector {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 40%;
        height: 80%;
        padding: 10px;
        border: 2px solid rgba(38, 214, 149, 0.15);
        box-shadow: 1px 2px 3px rgba(38, 214, 149, 0.192);
        border-radius: 2px;
        margin: 10px;
    }
    .small-feed-selector {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 40%;
        padding: 15px;
        border: 2px solid rgba(38, 214, 149, 0.15);
        border-radius: 2px;
        margin: 10px;
    }
    .small-feed-selector-current {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 40%;
        padding: 15px;
        background: rgba(38, 214, 149, 0.2);
        border-bottom: 4px solid rgba(38, 214, 149, 0.3);
        border-radius: 2px;
        margin: 10px;
    }
    .feed-selector:hover,
    .small-feed-selector:hover {
        background: rgba(38, 214, 149, 0.2);
        cursor: pointer;
    }

    .home-feed {
        height: 80%;
        width: auto;
        display: flex;
        justify-content: space-between;
        overflow-y: hidden;
        overflow-x: auto;
        /* border-top: 4px solid rgba(38, 214, 149, 0.3); */
    }

    .feed-container {
        display: flex;
        gap: 20px;
        min-width: 800px;
        overflow-x: auto;
        flex: 1;
    }

    .route-feed,
    .trip-feed,
    .comp-trip-feed {
        flex: 1;
        min-width: 400px;
        overflow-y: auto;
    }
</style>
