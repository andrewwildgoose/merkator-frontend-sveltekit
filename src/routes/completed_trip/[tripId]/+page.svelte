<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';

    let completedTripId = $page.params.tripId;
    let token;
    let loading = true;
    let completedTrip;

    onMount(async () => {
        token = localStorage.getItem('token');
        
        if (!token) {
            // Redirect to login if token is not present
            goto('/login');
            return;
        }
        
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        fetchCompletedTrip(headers, completedTripId);
    
    });

    const fetchCompletedTrip = async (headers, completedTripId) => {
        try {
            const response = await fetch(`http://localhost:3000/merkator/user/completed_trip/${completedTripId}`, {headers});
            if (response.ok) {
                completedTrip = await response.json();
                console.log("Completed trip fetched")
            } else {
                console.log("Error fetching trip")
                errorMessage = "Error fetching trip"
            }
        } catch (error) {
            errorMessage = "An error occurred while fetching the trip.";
        }
        finally {
            loading = false;
        }

    }
</script>

<div>
    {completedTrip.tripName}
</div>