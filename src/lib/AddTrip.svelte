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





<div class="trip-create">
    <h2>Create Trip</h2>
    <p>Creating a trip will allow you to add routes<br>to it and view their statistics as a full trip</p>
    <div class="modal-content">
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
    .trip-create {
        display: flex;
        padding: 10px;
        flex-direction: column;
        align-items: left;
        margin-bottom: 10px;
    }
    .modal-content {
        padding: 5px;
    }
    .error {
        color: red;
    }
</style>
