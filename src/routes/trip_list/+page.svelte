<script>
    import NavBar from "../../lib/navBar.svelte";
    import TripsList from "../../lib/tripsList.svelte";

</script>
<div class="trip_list">
    
    <NavBar />

    <TripsList />
</div>

<style>
    .trip_list {
        text-align: center;
        display: block;
        margin: 20px auto;
    }
</style>