<script>
    import Card from "../../lib/card.svelte";
    let user;

    async function fetchUser() {
        console.log("attemtping fetchUser")
        const response = await fetch('http://localhost:3000/merkator/user/64a96ca81716a23702501f57');
        user = await response.json();
    }
</script>

<div class="user_home">
    
    <button><a href="/">home</a></button>
    <button><a href="/route_list">routes</a></button>
    <button><a href="/trip_list">trips</a></button>

    <Card on:load={fetchUser()}>
        {#if user !== undefined}
        <h4>welcome {user.username}!</h4>
        <h4>routes:</h4>
            {:else}
            <p>User not defined</p>
        {/if}
    </Card>

    
</div>

<style>
    .user_home {
        text-align: center;
        display: block;
        margin: 20px auto;
    }
</style>