<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { units, deleteTrip, userRoutes, fetchUserRoutes } from '../stores';
    import TripMap from './TripMap.svelte';
    import StaticMap from './StaticMap.svelte';
    import LoadingIcon from './LoadingIcon.svelte';

    export let trip;
    export let tripId

    let token;
    let loading = true;
    let tripRoutes = [];
    let data;
    
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

        // If userRoutes not present, fetch the routes from the back end
        if ($userRoutes.length === 0 || $userRoutes === undefined) {
            await fetchUserRoutes(headers);
            loading = false;
        };

        // If trip not present, fetch the data from the back end
        if (!trip) {
            try {
                


                const response = await fetch(`http://localhost:3000/merkator/user/trip/${tripId}`, { headers });
                if (response.ok) {
                    trip = await response.json();
                    tripRoutes = findRoutesByIds(trip.tripRouteIds, $userRoutes);
                } else {
                    // Handle error, e.g., unauthorized
                    console.error('Failed to fetch user trips');
                }
            } finally {
                loading = false; // Set loading to false once data is fetched
            }
        }

        tripRoutes = findRoutesByIds(trip.tripRouteIds, $userRoutes);

        loading = false;
    });

    function findRoutesByIds(routeIds, userRoutes) {
        return userRoutes.filter(route => routeIds.includes(route.idString));
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this trip?')) {
            const response = await deleteTrip(id, token);
            console.log(response);
            if (response.ok) {
                handleSuccess(token)
            }
        }
    };
</script>

{#if loading}
    <div class="loading-container">
        <LoadingIcon />
        <p>Loading trip . . .</p>
    </div>
{:else}
    <div class="full-detail">
        
        <div class="trip-detail">
            <h2>{trip.tripName}</h2>
            <div class="map">
                <TripMap 
                tripGpxStrings={trip.tripGpxStrings} 
                tripRouteColours={trip.tripRouteColours}
                plannedRoutes={trip.routeCount} 
                length={trip.tripLength} />
            </div>
            <div class="basic-info">
                <p>
                Distance: <p2>{trip.tripLength} {$units} </p2> |   
                Elevation gain: <p2>{trip.tripElevationGain} m</p2>  |   
                Elevation loss: <p2>{trip.tripElevationLoss} m</p2>  |   
                No. of routes: <p2>{trip.routeCount}   </p2>
                {#if trip.tripDescription !== null}|  {trip.tripDescription}{/if}
                </p>
            </div>
            <!-- <div class="elev-chart">
                <ElevationChart data={data}/>
            </div>
            -->
        </div>
        <div class="trip-route-feed">
            <h4>Trip routes</h4>
            <div class="trip-routes">
                {#each tripRoutes as route (route.id)}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class='route-item' on:click={goto(`/route_detail/${route.idString}`)}>
                    <div class='map-container'>
                        <StaticMap mapUrl={route.routeStaticMapUrl}/>
                    </div>
                    <div class='route-details'>
                        <h4>{route.routeName}</h4>
                        <p>
                            Distance: <p2>{route.routeLength} {$units}</p2>
                            <br>
                            Elevation gain: <p2>{route.routeElevationGain} m</p2>
                            <br>
                            Elevation loss: <p2>{route.routeElevationLoss} m</p2>
                        </p>
                        <button on:click={goto(`/route_detail/${route.idString}`)}>View route</button>
                    </div>
                </div>
            {/each}
            </div>
        </div>
        <button on:click={() => handleDelete(trip.idString)}>Delete trip</button>
    </div>    
{/if}

<style>
    .full-detail {
        display: flex;
        flex-direction: column; /* Change to column layout to stack elements vertically */
        align-items: center; /* Center-align the contents horizontally */
        justify-content: flex-start; /* Align contents to the top of the container */
        width: 100%;
        /* overflow-y: auto; */
    }
    .trip-detail {
        position: relative;
        flex-grow: 1;
        text-align: left;
        display: block;
        margin: 20px auto;
        padding: 10px;
    }
    .basic-info {
        text-align: center;
        padding: 10px;
    }
    
    .map,
    .elev-chart {
        display: flex;
        flex-grow: 1;
        box-sizing: border-box;
        position: relative;
        width: 100%;
        margin: 0 auto;
    }

    .trip-route-feed {
        display: flex;
        flex-direction: column; /* Change to column layout to stack elements vertically */
        flex-grow: 1;
        align-items: left; /* Center-align the contents horizontally */
        padding: 5px;
        width: 100%;
        
    }

    .trip-routes {
        display: flex; /* Display items horizontally */
        justify-content: flex-start; /* Align items to the start of the container */
        flex-grow: 1;
        width: 80%;
        text-align: left;
        margin: 5px auto;
        padding: 5px;
        flex-wrap: nowrap;
        width: 100%;
        overflow-x: auto;
    }

    .route-item {
        display: flex;
        align-items: center;
        gap: 5px;
        background: rgba(0, 0, 0, 0.1);
        padding: 5px;
        border-radius: 2px;
        box-shadow: 2px 4px 6px rgba(38, 214, 149, 0.192);
        margin: 5px;
        cursor: pointer;
    }

    .map-container {
        width: 100px;
        height: 100px;
        overflow: hidden;
    }

    .route-details {
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>