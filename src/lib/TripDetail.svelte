<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { units, deleteTrip, userRoutes, fetchUserRoutes, rgbToHex } from '../stores';
    import TripMap from './TripMap.svelte';
    import StaticMap from './StaticMap.svelte';
    import LoadingIcon from './LoadingIcon.svelte';
    import ElevationChart from './ElevationChart.svelte';

    export let trip;
    export let tripId

    let token;
    let loading = true;
    let tripRoutes = [];
    let tripElevData = [];
    let datasets = [];
    let data;
    let numMarkers = 0;
    let colors = [];
    
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
                
                const response = await fetch(`http://${import.meta.env.VITE_VM_IP}:3000/merkator/user/trip/${tripId}`, { headers });
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

        // Elevation graph data building
        // Adds a number of null values to the start of each set of data 
        // to ensure correct starting position on the graph 
        for (const route of tripRoutes) {
            const routeData = JSON.parse(route.routeGpxString);
            let elevPoints = [];
            for (let i = 0; i < numMarkers; i++) {
                elevPoints.push(null);
            }
            const elevData = routeData.trk.trkseg.trkpt.map(point => point.ele)
            elevPoints = elevPoints.concat(elevData);

            tripElevData.push(elevPoints);
            numMarkers += elevData.length;
        }

        // Add a number of null values to the end of each dataset to ensure graph displays correctly
        for (const elevPoints of tripElevData){
            const postDataMarkers = numMarkers - elevPoints.length;
            for (let i = 0; i< postDataMarkers; i++) {
                elevPoints.push(null);
            } 
        }

        // Calculate position in distance for x axis
        const distMarkers = [];

        for (let i = 0; i < numMarkers; i++) {
            const markerPosition = (i / (numMarkers - 1)) * trip.tripLength; 
            distMarkers.push(markerPosition); 
        }

        for (let i = 0; i < tripElevData.length; i++) {
            const routeElevPoints = tripElevData[i];
            const dataset = {
                name: `${tripRoutes[i].routeName}`,
                values: routeElevPoints,
            };
            datasets.push(dataset);
            colors.push(rgbToHex(
                    trip.tripRouteColours[i][0],
                    trip.tripRouteColours[i][1],
                    trip.tripRouteColours[i][2]
                    ))
        }

        // Dataset for elevation graph
        data = {
            labels: distMarkers.map(marker => `${marker.toFixed(2)} ${$units}`),
            datasets: datasets,
        };

        loading = false;
    });

    function findRoutesByIds(routeIds, userRoutes) {
        return userRoutes.filter(route => routeIds.includes(route.idString));
    }

    const handleSuccess = () => {
        goto(`/`);
    }

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this trip?')) {
            loading = true;
            const response = await deleteTrip(id, token);
            console.log(response);
            if (response.ok) {
                handleSuccess()
            }
        }
    };
</script>

{#if loading}
    <div class="loading-container">
        <LoadingIcon />
        <p>Loading . . .</p>
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
            <div class="elev-chart">
                <h4>Elevation chart</h4>
                <ElevationChart data={data} colors={colors}/>
            </div>
        </div>
        <div class="trip-route-feed">
            <h4>Trip routes</h4>
            <div class="trip-routes">
                {#each tripRoutes as route (route.id)}
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <div class='route-item' on:click={goto(`/route_detail/${route.idString}`)}>
                    <p2>{route.routeName}</p2>
                    <div class='route-inner'>
                        <div class='map-container'>
                            <StaticMap mapUrl={route.routeStaticMapUrl}/>
                        </div>
                        <div class='route-details'>
                            
                            <p>
                                Distance:
                                <br>
                                <p2>{route.routeLength} {$units}</p2>
                                <br>
                                Elevation gain:
                                <br>
                                <p2>{route.routeElevationGain} m</p2>
                                <br>
                                Elevation loss:
                                <br>
                                <p2>{route.routeElevationLoss} m</p2>
                            </p>
                        </div>
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
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        width: 100%;
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
        white-space: normal;
    }
    
    .map {
        display: flex;
        flex-grow: 1;
        box-sizing: border-box;
        position: relative;
        width: 100%;
        margin: 0 auto;
    }
    .elev-chart {
        box-sizing: border-box;
        position: relative;
        width: 90%;
        margin: 0 auto;
    }

    .trip-route-feed {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: left;
        padding: 5px;
        width: 100%;
    }

    .trip-routes {
        display: flex;
        justify-content: flex-start;
        flex-grow: 1;
        width: 80%;
        text-align: left;
        margin: 5px auto;
        padding: 5px;
        flex-wrap: nowrap;
        width: 100%;
        overflow-x: auto;
        border: 2px solid rgba(38, 214, 149, 0.15);
        box-shadow: 1px 2px 3px rgba(38, 214, 149, 0.192);
        border-radius: 2px;
    }

    .route-item {
        display: inline-block;
        text-align: center;
        width: 220px;
        padding: 10px;
        border-radius: 2px;
        box-shadow: 1px 2px 3px rgba(38, 214, 149, 0.192);
        border: 2px solid rgba(38, 214, 149, 0.15);
        margin: 5px;
        cursor: pointer;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .route-inner {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        width: 100%;
        height: 100%;
    }

    .map-container {
        margin-top: 10px;
        width: 100px;
        height: 100px;
        overflow: hidden;
    }

    .route-details {
        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>