<script>
    import { userRoutes } from '../stores';

    let selectedRouteIDs = [];
    export let tripName;
    export let idString;

    import { createEventDispatcher } from 'svelte';
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

<div class="add-routes-modal">
    <h2>Add Routes to {tripName}</h2>
    <p>Select the routes you want to add to the trip:</p>
    
    <!-- List of checkboxes for route selection -->
    <div class="overlay">
        <div class="overlay-content">
            {#each $userRoutes as route (route.id)}
                <label>
                    <input type="checkbox" on:change={() => toggleRouteSelection(route.idString)} />
                    {route.routeName}
                </label>
            {/each}
            <button on:click={handleAddRoutes}>Add Selected Routes</button>
        </div>
    </div>
</div>
    

<style>
    /* Add styles */
</style>