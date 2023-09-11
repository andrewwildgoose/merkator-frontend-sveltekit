<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    export let title = "merkator"
    let userDetails = null; // Store fetched user details

    onMount(async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            // Redirect to login if token is not present
            goto('/auth/login');
            return;
        }
        
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        
        // Fetch user details from the backend
        const response = await fetch('http://localhost:3000/merkator/user/details', { headers });
        
        if (response.status === 403) {
                // Redirect to login if 403 Forbidden is received
                goto('/auth/login');
                return;
            }

        if (response.ok) {
            userDetails = await response.json();
        } else {
            // Handle error, e.g., unauthorized
            console.error('Failed to fetch user details');
        }
    });
</script>

<div class="title">
    <h1>{title}</h1>
    {#if userDetails}
    <div class="welcome">
        <h4>Welcome, {userDetails.name}!</h4>
    </div>
    {/if}
</div>

<style>
    .title {
        display: flex;
        align-items: baseline; /* Align items to the bottom */
        justify-content: space-between; /* Create space between title and welcome */
    }

    .welcome {
        margin-left: 50px; /* Add a gap between title and welcome */
    }
</style>