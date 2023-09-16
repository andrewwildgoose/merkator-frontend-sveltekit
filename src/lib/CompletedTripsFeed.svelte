<!-- Component to display a user's feed of completed trips -->

<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { units, userCompletedTrips } from '../stores';
    import Card from './card.svelte';
    import LoadingIcon from './LoadingIcon.svelte';
    import StaticMap from './StaticMap.svelte';

    let compTripsStore;
    let token;
    let loading = true;

    onMount(async () => {
        token = localStorage.getItem('token');
        
        if (!token) {
            // Redirect to login if token is not present
            goto('/login');
            return;
        }

        // Checking to see if userCompletedTrips have already been loaded to speed page load time
        if (compTripsStore === undefined || compTripsStore.length === 0) {
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            fetchUserCompletedTrips(headers);            
        } else {
            // Data is already loaded, set loading to false
            loading = false;
        }
    });

    const fetchUserCompletedTrips = async (headers) => {
        try {
            console.log('Fetching user completed trips');
            // Fetch user's trips from the backend
            const response = await fetch(`http://${import.meta.env.VITE_VM_IP}:3000/merkator/user/completed_trips`, { headers });
            if (response.ok) {
                compTripsStore = await response.json();
                userCompletedTrips.set(compTripsStore);
            } else {
                // Handle error, e.g., unauthorized
                console.error('Failed to fetch user completed trips');
            }
        } finally {
            loading = false; // Set loading to false once data is fetched
        }
    }

</script>

<div class="list-feed">
    <Card>
        <div class="card-content">
            <h2 class="card-title">Completed Trips</h2>
        </div>
    </Card>

    {#if loading}
        <div class="loading-container">
            <LoadingIcon />
            <p>
                Loading completed trips . . .
                <br><br>
                . . . this might take a minute.
            </p>
        </div>
    {:else if compTripsStore !== undefined && compTripsStore.length > 0}
        {#each compTripsStore.slice().reverse() as completedTrip (completedTrip.id)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class='feed-item' on:click={goto(`/completed_trip/${completedTrip.idString}`)}>
                <div class="inner-item">
                    <div class='map-container'>
                        <StaticMap mapUrl={completedTrip.tripStaticMapUrl}/>
                    </div>
                    <div class='comp-trip-details'>
                        <h4>{completedTrip.tripName}</h4>
                        <p>
                            No. of routes planned : <p2>{completedTrip.routeCount}</p2>
                            <br>
                            Planned distance: <p2>{completedTrip.tripLength} {$units}</p2>
                        </p>
                        <p>
                            No. of routes completed: <p2>{completedTrip.completedRouteCount}</p2>
                            <br>
                            Completed distance: <p2>{completedTrip.tripCompletedLength} {$units}</p2>
                        </p>
                    </div>
                </div>
            </div>
        {/each}
    {:else}
        <p>
            There are no completed trips to show. 
            <br><br>
            Time to get out there and completed one of your trips!
        </p>
    {/if}

</div>

<style>
        .comp-trip-details {
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 5px;
    }
</style>