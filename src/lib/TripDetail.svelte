<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { units, deleteTrip, userRoutes } from '../stores';
    import TripMap from './TripMap.svelte';
    import StaticMap from './StaticMap.svelte';

    export let trip;

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
    <p>Loading trip details...</p>
{:else}
<div class="full-detail">
    <div class="trip-route-feed">
        {#each tripRoutes as route (route.id)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class='route-item' on:click={goto(`/route_detail/${route.idString}`)}>
                <div class='map-container'>
                    <StaticMap mapUrl={route.routeStaticMapUrl}/>
                </div>
                <div class='route-details'>
                    <h4>{route.routeName}</h4>
                    <p>
                        Distance: {route.routeLength} {$units}
                        <br>
                        Elevation gain: {route.routeElevationGain} m
                        <br>
                        Elevation loss: {route.routeElevationLoss} m
                        <br>
                        {#if route.routeDescription !== "Optional.empty"}{route.routeDescription}{/if}
                    </p>
                    <button on:click={goto(`/route_detail/${route.idString}`)}>View route</button>
                </div>
            </div>
        {/each}
    </div>
    <div class="trip-detail">
        <h2>{trip.tripName}</h2>
        <div class="map">
            <TripMap 
            tripGpxStrings={trip.tripGpxStrings} 
            tripRouteColours={trip.tripRouteColours} />
        </div>
        <div class="basic-info">
            <p>
            Distance: {trip.tripLength} {$units}  |   
            Elevation gain: {trip.tripElevationGain} m  |   
            Elevation loss: {trip.tripElevationLoss} m  |   
            No. of routes: {trip.routeCount}   
            {#if trip.tripDescription !== null}|  {trip.tripDescription}{/if}
            </p>
        </div>
        <!-- <div class="elev-chart">
            <ElevationChart data={data}/>
        </div>
        -->
        <button on:click={() => handleDelete(trip.idString)}>Delete trip</button>
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
    .basic-info,
    .map,
    .elev-chart {
        box-sizing: border-box;
        position: relative;
        width: 800px;
        margin: 0 auto;
    }

    .trip-route-feed {
    display: inline-block;
    flex-basis: 30%;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding: 10px;
    margin-left: 0;
    overflow-y: auto;
    }

    .route-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(0, 0, 0, 0.1);
    padding: 10px;
    border-radius: 2px;
    box-shadow: 2px 4px 6px rgba(38, 214, 149, 0.192);
    margin: 10px;
    cursor: pointer;
    }

    .map-container {
        width: 100px;
        height: 100px;
        overflow: hidden;
    }

    .route-details {
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>