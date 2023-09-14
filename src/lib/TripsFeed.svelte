<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { units, deleteTrip, userTrips } from '../stores';
    import AddTrip from './AddTrip.svelte';
    import Card from './card.svelte';
    import StaticMap from './StaticMap.svelte';
    import Modal from './Modal.svelte';
    import CompleteTrip from './CompleteTrip.svelte';
    import AddRoutesToTrip from './AddRoutesToTrip.svelte';
    import LoadingIcon from './LoadingIcon.svelte';


    let tripsStore;
    let token;
    let loading = true; // Added loading indicator
    let selectedModalProps; // Props to pass modal component
    let selectedModalComponent = null;
    let showOptionsFor = null;
    let showOptions = false;
    let modalOpen = false;



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

    function toggleOptions(tripId) {
        showOptionsFor = tripId;
        showOptions = !showOptions;
    }

    const openRoutesOverlay = (selectedTripForRoutes) => {
        selectedModalComponent = AddRoutesToTrip;
        selectedModalProps = selectedTripForRoutes;
        modalOpen = true;
    };

    const handleSuccess = () => {
        loading = true;
        console.log("TF: handling success")
        closeModal();
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        
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

    const openCreateModal = () => {
        selectedModalComponent = AddTrip;
        modalOpen = true;
    }
    
    // Handle click on complete trip button
    const handleCompletion = async(tripId) => {
        showModal(CompleteTrip, tripId) 
    }
    
    const showModal = (component, tripId) => {
        selectedModalComponent = component;
        selectedModalProps = { tripId };
        modalOpen = true;
        console.log("Modal Components & Props: ", selectedModalComponent, selectedModalProps)
    };
    
    const closeModal = () => {
        console.log("TF: close modal received")
        selectedModalComponent = null;
        selectedModalProps = null;
        modalOpen = false;
    };


</script>

<div class="list-feed">
    <Card>
        <div class="card-content">
            <h2 class="card-title">Trips</h2>
            <button on:click={openCreateModal}>Create Trip</button>
        </div>
    </Card>

    {#if loading}
        <div class="loading-container">
            <LoadingIcon />
            <p>Loading trips . . .</p>
        </div>
    {:else if tripsStore !== undefined && tripsStore.length > 0}
        {#each tripsStore.slice().reverse() as trip (trip.id)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class='feed-item' on:click={() => trip.tripRouteNames.length !== 0 ? goto(`/trip_detail/${trip.idString}`, loading=true) : openRoutesOverlay(trip)}>
                {#if trip.tripRouteNames.length !== 0}
                <div class="inner-item">
                    <div class='map-container'>
                        <StaticMap mapUrl={trip.tripStaticMapUrl}/>
                    </div>
                    <div class='trip-details'>
                        <h4>{trip.tripName}</h4>
                        <p>
                            Distance: <p2>{trip.tripLength} {$units}</p2>
                            <br>
                            Elevation gain: <p2>{trip.tripElevationGain} m</p2>
                            <br>
                            Elevation loss: <p2>{trip.tripElevationLoss} m</p2>
                            <br>
                            No. of routes: <p2>{trip.routeCount} </p2>
                            <br>
                            {#if trip.tripDescription !== null}Description: {trip.tripDescription}{/if}
                        </p>
                        
                    </div>
                    
                </div>
                <div class="button-container">
                    <button on:click={goto(`/trip_detail/${trip.idString}`, loading=true)}>View trip</button>
                    <button class="options-button" on:click={(event) => {event.stopPropagation(); toggleOptions(trip.idString)}}>
                        Options</button>
                    <div class="options {showOptionsFor === trip.idString && showOptions && 'visible'}">
                        <button on:click={(event) => {event.stopPropagation(); openRoutesOverlay(trip)}}>Add routes</button>
                        <button on:click={(event) => {event.stopPropagation(); handleCompletion(trip.idString)}}>Complete trip</button>
                        <button on:click={(event) => {event.stopPropagation(); handleDelete(trip.idString);}}>Delete trip</button>
                    </div>
                </div>
                {:else}
                <div class="inner-item">
                    <div class='trip-details'>
                        <h4>{trip.tripName}</h4>
                        <p>This trip doesn't have any routes yet.</p>
                        
                    </div>
                </div>
                <div class="button-container">
                    <button on:click={() => openRoutesOverlay(trip)}>Add Routes</button>
                    <button on:click={(event) => {event.stopPropagation(); handleDelete(trip.idString);}}>Delete trip</button>
                </div> 
                {/if}
            </div>
        {/each}
    {:else}
        <p>There are no trips to show, add a trip!</p>
    {/if}
    {#if modalOpen}
        <Modal on:close={closeModal}>
            <script>console.log("modal open")</script>
                <svelte:component on:add-success={handleSuccess} on:close={closeModal} this={selectedModalComponent} {...selectedModalProps} />
        </Modal>
    {/if}
</div>

<style>

    .button-container {
        padding: 2px;
        margin: 5px;
    }

    .options {
        display: none;
        margin-top: 5px;
    }

    .options-button {
        cursor: pointer;
        color: #26D696;
        margin-top: 5px;
    }

    .options.visible {
        display: block;
    }

    .feed-item .trip-details {
        display: flex;
        flex-direction: column;
    }

    .feed-item button {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        border: none;
        border-radius: 2px;
        cursor: pointer;
    }

    .map-container {
        width: 150px;
        height: 150px;
        overflow: hidden;
        padding-right: 5px;
    }

    .trip-details {
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 5px;
    }
</style>