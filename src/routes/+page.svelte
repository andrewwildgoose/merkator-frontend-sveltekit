<script>
    import Card from "../lib/card.svelte";
    import RoutesList from "../lib/routesList.svelte";
    import TripsList from "../lib/tripsList.svelte";

    let welcome;

    async function fetchWelcome() {
        console.log("attemtping fetchWelcome")
        const response = await fetch('http://localhost:3000/merkator/user/');
        const responseData = await response.json();
        welcome = responseData.welcome_message;
    }
</script>

<div class="home" on:load={fetchWelcome()}>
    <p>{welcome}</p>
    <button><a href="/">home</a></button>
    <button><a href="/trip_list">trips</a></button>
    <button><a href="/route_list">routes</a></button>
    <button><a href="/user_home">user home</a></button>
    <button><a href="/route_detail">route detail</a></button>
    
    
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
