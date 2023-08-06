<script>
    let routeDetail;

    async function fetchRoute() {
        console.log("attempting fetchRoute");
        const response = await fetch("http://localhost:3000/merkator/user/64a96ca81716a23702501f57/route_gpx_string/64cd0aae3211936cddad0635");
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

