<script>

    import { units } from '../stores';

    //store the routes to display for the user
    let routesStore;

    async function fetchRoutesStore() {
        console.log("attemtping fetchRoutesStore")
        const response = await fetch('http://localhost:3000/merkator/user/64a96ca81716a23702501f57/routes');
        console.log("response: ", response);
        routesStore = await response.json();
        console.log("COMPLETED fetchRoutesStore!")
    }

    //handle click on the delete route button
    const handleClick = (id) => {
        routesStore.update(routes => routes.filter(route => route.id != id));
        console.log(id);
    };

</script>

<div class="routesListFeed" on:load={fetchRoutesStore()}>
    
    <h1>Routes</h1>
    
    {#if routesStore !== undefined}
        {#each routesStore as route (route.id)}
            <div class='centre'>
                <h4>{route.routeName}</h4>
                <p>{$units}<br>{route.routeDescription}</p>
                <button on:click={() => handleClick(route.id)}>delete route</button>
            </div>
            <br>
        {/each}
        {:else}
            <p>There are no routes to show...</p>
    {/if}
</div>

<style>
    .routesListFeed {
        text-align: center;
    }
    .centre {
        text-align: center;
        border-radius: 2px;
        border: 2px solid rgba(38, 214, 150, 0.1);
        margin: auto;
        width: 50%;
        padding: 10px;
    }
</style>


