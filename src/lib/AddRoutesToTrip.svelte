<script>
    import { userRoutes } from '../stores';
    import { toggleRouteSelection, handleAddRoutes, closeRoutesOverlay } from './TripsFeed.svelte';

    let selectedTripForRoutes;
</script>

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