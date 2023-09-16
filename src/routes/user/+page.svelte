<!-- Page for displaying a user's details. Not yet in use. -->

<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';

    let userDetails = null; // Store fetched user details

    onMount(async () => {
        const token = localStorage.getItem('token');
        
        if (!token) {
            // Redirect to login if token is not present
            goto('/login');
            return;
        }
        
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        
        // Fetch user details from the backend
        const response = await fetch('http://localhost:3000/merkator/user/details', { headers });
        if (response.ok) {
            userDetails = await response.json();
        } else {
            // Handle error, e.g., unauthorized
            console.error('Failed to fetch user details');
        }
    });
</script>

{#if userDetails}
    <div>
        <h1>Welcome, {userDetails.name}!</h1>
        <!-- Display user details, routes, trips, etc. -->
    </div>
{:else}
<div>
    <h1>User details not found</h1>
    <!-- Display user details, routes, trips, etc. -->
</div>
{/if}
