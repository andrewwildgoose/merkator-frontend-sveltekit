<script>
    import Card from "../lib/card.svelte";
    import NavBar from "../lib/navBar.svelte";
    import RoutesList from "../lib/routesList.svelte";
    import TripsList from "../lib/tripsList.svelte";



</script>

<div class="home">
    <NavBar />
</div>

<div class="homeFeed">
    <div class="routeFeed">
        <Card>
            <RoutesList /> 
        </Card>
    </div>

    <div class="tripFeed">
        <Card>
            <TripsList />
        </Card>
    </div>
</div>



<style>
    .home {
        text-align: center;
        display: block;
        margin: 20px auto;
    }
    .homeFeed {
        text-align: center;
        
    }

</style>
