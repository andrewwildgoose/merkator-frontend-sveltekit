<script>
    import { userRoutes } from '../stores';
    import LoadingIcon from './LoadingIcon.svelte';
    import { createEventDispatcher } from 'svelte';
    
    let selectedRouteIDs = [];
    export let tripName;
    export let idString;
    let loading = true;

    $: {
        if ($userRoutes.length > 0) {
            loading = false;
        }
    }
    const dispatch = createEventDispatcher();

    const toggleRouteSelection = (routeId) => {
        if (selectedRouteIDs.includes(routeId)) {
            selectedRouteIDs = selectedRouteIDs.filter(id => id !== routeId);
        } else {
            selectedRouteIDs = [...selectedRouteIDs, routeId];
        }
        console.log("Selected routes: ", selectedRouteIDs)
    };

    // Handle adding selected routes to the trip
    const handleAddRoutes = async () => {
        console.log("attempting add routes to trip")
        
        if (selectedRouteIDs.length === 0) {
            console.log("No routes selected")
            return;
        }
        if (!idString) {
            console.log("No idString")
            return;
        }

        const token = localStorage.getItem('token'); 

        for (const routeId of selectedRouteIDs) {
            console.log("tripId: ", idString)
            console.log("routeId: ", routeId)
            const response = await fetch('http://localhost:3000/merkator/user/trip/add_route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tripId: idString,
                    routeId: routeId
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
        console.log("add routes successful. invoking closeRoutesOverlay()")
        closeRoutesOverlay(); // Close the overlay after adding routes
    };

    
    // Close the routes overlay
    const closeRoutesOverlay = () => {
        // Clear any selections and close the overlay
        $userRoutes.forEach(route => route.selected = false);
        console.log("invoking closeModal()")
        closeModal();
    };
    
    // Close the modal
    const closeModal = () => {
        dispatch('add-success');
        console.log("close event dispatched")
    };
</script>

<div>
    {#if loading}
        <div class="loading-container">
            <LoadingIcon />
            <p>Loading routes . . .</p>
        </div>
    {:else}
        
        <h2>Add Routes to {tripName}</h2>
        <p>Select the routes you want to add to the trip:</p>
        <div class="add-routes-modal">
                <div class="overlay-content">
                    {#each $userRoutes as route (route.id)}
                        <button
                            class:selected-route={selectedRouteIDs.includes(route.idString)}
                            on:click={() => toggleRouteSelection(route.idString)}
                        >
                            {route.routeName}
                        </button>
                    {/each}
                    
                </div>
        </div>
        <button on:click={handleAddRoutes}>Add Selected Routes</button>
    {/if}
</div>

    

<style>

    .selected-route {
        color: #26D696; 
        font-weight: bold; 
        background-color: rgba(38, 214, 149, 0.1);
    }

    .overlay-content {
        display: grid;
        align-items: center;
        margin-bottom: 10px;
        width: 100%;
        max-height: 60vh;
        overflow: hidden;
        overflow-y: auto;
        
    }


</style>
