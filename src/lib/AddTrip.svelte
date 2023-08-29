<script>

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    let tripName = '';
    let errorMessage = '';

    const handleSubmit = async (event) => {
        event.preventDefault();

        errorMessage = '';

        if (tripName.trim() === '') {
            errorMessage = 'Please enter a trip name';
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            errorMessage = 'No token found';
            return;
        }        

        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        try {
            const response = await fetch("http://localhost:3000/merkator/user/new_trip", {
                method: "POST",
                headers,
                body: tripName,
            });

            if (response.ok) {
                //Handle success
                dispatch('add-success');
                console.log(response)
                    console.log("AT: Success event dispatched");
                
            } else {
                // Handle error
                errorMessage = "Error creating trip.";
            }
        } catch (error) {
        errorMessage = "An error occurred while creating the trip.";
        }};
</script>





<div class="modal">
    <div class="modal-content">
        <h2>Upload Route</h2>
        <form on:submit={handleSubmit}>
            <label>
                Trip Name:
                <input type="text" bind:value={tripName} />
            </label>
        <button type="submit">Create</button>
        {#if errorMessage}
            <p class="error">{errorMessage}</p>
        {/if}
        </form>
    </div>
</div>

<style>
    .error {
        color: red;
    }
</style>
