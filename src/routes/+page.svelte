<script>
    import Card from "../lib/card.svelte";
    import NavBar from "../lib/navBar.svelte";
    import RoutesFeed from "../lib/RoutesFeed.svelte";
    import TripsFeed from "../lib/TripsFeed.svelte";

</script>

<div class="home">
    <NavBar />
    
</div>

<div class="homeFeed">

    <div class="routeFeed">
        <Card>
            <RoutesFeed />
        </Card>
    </div>

    <div class="tripFeed">
        <Card>
            <TripsFeed />
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
