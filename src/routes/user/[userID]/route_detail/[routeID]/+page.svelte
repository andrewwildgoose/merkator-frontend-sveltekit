<script>

    import NavBar from "../lib/navBar.svelte";
    
    let userID;
    let routeID;
    let routeDetail;

    async function fetchRoute() {
        console.log(`http://localhost:3000/merkator/user/${userID}/route_gpx_string/${routeID}`)
        const response = await fetch(`http://localhost:3000/merkator/user/${userID}/route_gpx_string/${routeID}`);
        console.log("response: ", response);
        const responseData = await response.json();
        console.log("responseData", responseData);
        routeDetail = responseData; // No need for responseData.metadata here
        console.log("route Details", routeDetail);
    }
</script>

<div class="route_detail" on:load={fetchRoute()}>
    <NavBar />

    {#if routeDetail}
    <p>
        Route Name: {routeDetail.metadata.name}<br>
        Activity: {routeDetail.trk.type}
    </p>
    {:else}
        <p>Loading...</p>
    {/if}
</div>
