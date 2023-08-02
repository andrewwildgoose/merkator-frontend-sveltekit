<script>
    import TripsList from "../../lib/tripsList.svelte";

</script>
<div class="trip_list">
    
    <button><a href="/">home</a></button>
    <button><a href="/route_list">routes</a></button>
    <button><a href="/user_home">user home</a></button>

    <TripsList />
</div>

<style>
    .trip_list {
        text-align: center;
        display: block;
        margin: 20px auto;
    }
</style>