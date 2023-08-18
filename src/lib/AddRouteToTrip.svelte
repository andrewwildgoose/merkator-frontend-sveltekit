<script>
    import { userRoutes, userTrips } from "../stores";

    let selectedTripID = '';
    let selectedRouteIDs = [];

    const toggleRouteSelection = (routeID) => {
        if (selectedRouteIDs.includes(routeID)) {
            selectedRouteIDs = selectedRouteIDs.filter(id => id !== routeID);
        } else {
            selectedRouteIDs = [...selectedRouteIDs, routeID];
        }
    };

    const handleAddRoutes = async () => {
        if (!selectedTripID || selectedRouteIDs.length === 0) {
            // Handle case where no trip or routes are selected
            return;
        }

        const token = localStorage.getItem('token'); // Replace with your token retrieval method

        for (const routeID of selectedRouteIDs) {

            const response = await fetch('http://localhost:3000/merkator/user/trip/add_route', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    tripID: selectedTripID,
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
    };
</script>

<label>
    Select Trip
    <select bind:value={selectedTripID}>
        <option />
        {#each $userTrips as trip (trip.id)}
            <option value={trip.idString} label={trip.tripName} />
        {/each}
    </select>
</label>

<h2>Select Routes to Add</h2>
{#each $userRoutes as route (route.id)}
    <label>
        <input type="checkbox" checked={selectedRouteIDs.includes(route.idString)} on:change={() => toggleRouteSelection(route.idString)} />
        {route.routeName}
    </label>
{/each}

<button on:click={handleAddRoutes}>Add Routes</button>
