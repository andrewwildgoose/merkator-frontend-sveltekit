<script>
    
    let userID;
    let routeID;
    let routeDetail;

    async function fetchRoute() {
        const response = await fetch(`http://localhost:3000/merkator/user/${userID}/route_gpx_string/${routeID}`);
        console.log("response: ", response);
        const responseData = await response.json();
        console.log("responseData", responseData);
        routeDetail = responseData; // No need for responseData.metadata here
        console.log("route Details", routeDetail);
    }
</script>

<div class="route_detail" on:load={fetchRoute()}>
    {#if routeDetail}
    <p>
        Route Name: {routeDetail.metadata.name}<br>
        Activity: {routeDetail.trk.type}
    </p>
    {:else}
        <p>Loading...</p>
    {/if}
</div>
