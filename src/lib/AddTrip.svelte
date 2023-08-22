<script>

    let showModal = false;

    const openModal = () => {
        showModal = true;
    };

    const closeModal = () => {
        showModal = false;
    };
    
    let tripName = '';
    let errorMessage = '';

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (tripName.trim() === '') {
            errorMessage = 'Please enter a trip name';
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            errorMessage = 'No token found';
            return;
        }

        // const formData = new FormData();
        // formData.append('tripName', tripName);
        // console.log(formData);
        

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
                // Handle success
                closeModal();
                const tripSuccessEvent = new CustomEvent('trip-success');
                dispatch(tripSuccessEvent);
                
            } else {
                // Handle error
                errorMessage = "Error creating trip.";
            }
        } catch (error) {
        errorMessage = "An error occurred while creating the trip.";
        }
        };
</script>


<main>
    <button on:click={openModal}>Create trip</button>
        {#if showModal}
        <div class="modal">
            <div class="modal-content">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="close" on:click={closeModal}>&times;</span>
                <h2>Upload Route</h2>
                <form on:submit={handleSubmit}>
                    <label>
                        Trip Name:
                        <input type="text" bind:value={tripName} />
                    </label>
                <button type="submit">Create</button>
                <button on:click={closeModal}>Cancel</button>
                {#if errorMessage}
                    <p class="error">{errorMessage}</p>
                {/if}
                </form>
            </div>
        </div>
        {/if}
</main>

<style>
    .error {
        color: red;
    }
</style>
