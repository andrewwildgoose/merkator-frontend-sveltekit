<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { units, deleteTrip, userRoutes, userTrips } from '../stores';
    import AddTrip from './AddTrip.svelte';
    import Card from './card.svelte';
    import StaticMap from './StaticMap.svelte';
    import Modal from './Modal.svelte';
    import CompleteTrip from './CompleteTrip.svelte';


    let tripsStore;
    let token;
    let loading = true; // Added loading indicator
    let selectedTripForRoutes = null; // Store the selected trip to add routes to
    let showRoutesOverlay = false; // Control the visibility of the routes overlay
    let selectedRouteIDs = []; // Store for the route's selected to be added to a trip
    let selectedModalProps; // Props to pass modal component

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

        fetchUserTrips(headers);
    });

    const fetchUserTrips = async (headers) => {
        try {
            // Fetch user's trips from the backend
            const response = await fetch('http://localhost:3000/merkator/user/trips', { headers });
            if (response.ok) {
                tripsStore = await response.json();
                userTrips.set(tripsStore);
            } else {
                // Handle error, e.g., unauthorized
                console.error('Failed to fetch user trips');
            }
        } finally {
            loading = false; // Set loading to false once data is fetched
        }
    }

    const openRoutesOverlay = (trip) => {
        selectedTripForRoutes = trip;
        showRoutesOverlay = true;
    };

    const closeRoutesOverlay = () => {
        selectedTripForRoutes = null;
        showRoutesOverlay = false;
    };

    const toggleRouteSelection = (routeID) => {
        if (selectedRouteIDs.includes(routeID)) {
            selectedRouteIDs = selectedRouteIDs.filter(id => id !== routeID);
        } else {
            selectedRouteIDs = [...selectedRouteIDs, routeID];
        }
    };

    const handleAddRoutes = async () => {
        if (!selectedTripForRoutes || selectedRouteIDs.length === 0) {
            // Handle case where no trip or routes are selected
            return;
        }

        const token = localStorage.getItem('token'); 

        for (const routeID of selectedRouteIDs) {
            const response = await fetch('http://localhost:3000/merkator/user/trip/add_route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tripID: selectedTripForRoutes.idString,
                    routeID: routeID
                })
            });

            if (!response.ok) {
                // Handle error, such as showing an error message
                console.error('Failed to add route to trip');
                return;
            }
        }

        // Handle success, such as updating the trips or showing a success message
        // ...

        // Reset selectedRouteIDs
        selectedRouteIDs = [];
        closeRoutesOverlay(); // Close the overlay after adding routes
    };

    const handleSuccess = () => {
        fetchUserTrips(headers);
    }

    // Handle click on the delete trip button
    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this trip?')) {
            const response = await deleteTrip(id, token);
            console.log(response);
            if (response.ok) {
                handleSuccess()
            }
        }
    };
    
    // Handle click on complete trip button
    const handleCompletion = async(tripId) => {
        showModal(CompleteTrip, tripId) 
    }

    let selectedModalComponent = null;
    
    const showModal = (component, tripId) => {
        selectedModalComponent = component;
        selectedModalProps = { tripId };
    };
    
    const closeModal = () => {
        selectedModalComponent = null;
    };


</script>

<div class="tripsListFeed">
    <h1>Trips</h1>
    <Card>
        <AddTrip on:trip-success={handleSuccess}/>
    </Card>

    {#if loading}
        <p>Loading trips . . .</p> <!-- Show loading indicator -->
    {:else if tripsStore !== undefined && tripsStore.length > 0}
        {#each tripsStore as trip (trip.id)}
            <div class='trip-item'>
                {#if trip.tripStaticMapUrl}
                <div class='map-container'>
                    <StaticMap mapUrl={trip.tripStaticMapUrl}/>
                </div>
                <div class='trip-details'>
                    <h4>{trip.tripName}</h4>
                    <p>
                        Distance: {trip.tripLength} {$units}
                        <br>
                        Elevation gain: {trip.tripElevationGain} m
                        <br>
                        Elevation loss: {trip.tripElevationLoss} m
                        <br>
                        No. of routes: {trip.routeCount} 
                        {#if trip.tripDescription !== null}{trip.tripDescription}{/if}
                    </p>
                    <button on:click={() => openRoutesOverlay(trip)}>Add Routes</button>
                    <button on:click={() => handleDelete(trip.idString)}>Delete trip</button>
                    <button on:click={() => handleCompletion(trip.idString)}>Complete trip</button>
                </div>
                {:else}
                <div class='trip-details'>
                    <h4>{trip.tripName}</h4>
                    <p>This trip doesn't have any routes yet.</p> 
                    <button on:click={() => openRoutesOverlay(trip)}>Add Routes</button>
                    <button on:click={() => handleDelete(trip.idString)}>Delete trip</button>
                </div>
                
                {/if}
                {#if selectedModalComponent}
                    <Modal on:close={closeModal}>
                        <svelte:component this={selectedModalComponent} {...selectedModalProps} />
                    </Modal>
                {/if}
                
            </div>
            <br>
        {/each}
    {:else}
        <p>There are no trips to show, add a trip!</p>
    {/if}

    {#if showRoutesOverlay}
    <!-- Overlay for adding routes to a trip -->
    <div class="overlay">
        <div class="overlay-content">
            <h2>Select Routes to Add to {selectedTripForRoutes.tripName}</h2>
            {#each $userRoutes as route (route.id)}
                <label>
                    <input type="checkbox" on:change={() => toggleRouteSelection(route.idString)} />
                    {route.routeName}
                </label>
            {/each}
            <button on:click={handleAddRoutes}>Add Selected Routes</button>
            <button on:click={closeRoutesOverlay}>Cancel</button>
        </div>
    </div>
{/if}
</div>

<style>
    .tripsListFeed {
        
        gap: 20px;
    }

    .trip-item {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 10px;
        background: rgba(0, 0, 0, 0.1);
        padding: 10px;
        border-radius: 2px;
        box-shadow: 2px 4px 6px rgba(38, 214, 149, 0.192);
        margin: 10px;
    }

    .map-container {
        width: 160px;
        height: 160px; 
    }

    .trip-details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>