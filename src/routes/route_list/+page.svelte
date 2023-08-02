<script>

    import RoutesList from "../../lib/routesList.svelte";

</script>
<div class="route_list">
    
    <button><a href="/">home</a></button>
    <button><a href="/trip_list">trips</a></button>
    <button><a href="/user_home">user home</a></button>

    <RoutesList />
</div>

<style>
    .route_list {
        text-align: center;
        display: block;
        margin: 20px auto;
    }
</style>