<script>

    import NavBar from "../lib/navBar.svelte";    
    
    let userID;
    let user;
    
    async function fetchUser() {
        console.log("attemtping fetchUser: http://localhost:3000/merkator/user/"+{$userID})
        const response = await fetch('http://localhost:3000/merkator/user/'+{$userID});
        user = await response.json();
    }
    
    import Card from "../../../lib/card.svelte";
</script>

<div class="user_home">

    <NavBar />

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