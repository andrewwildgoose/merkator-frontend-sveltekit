<!-- Component to add a new route to a user's routes -->

<script>

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
    
    let selectedFiles = [];
    let routeName = '';
    let errorMessage = '';

    const handleSubmit = async (event) => {
        event.preventDefault();

        errorMessage = '';

        if (!selectedFiles) {
            errorMessage = 'Please select a file';
            return;
        }

        if (routeName.trim() === '') {
            errorMessage = 'Please enter a route name';
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            errorMessage = 'No token found';
            return;
        }

        const formData = new FormData();
        formData.append('fileName', routeName);
        formData.append('file', selectedFiles[0]);
        console.log(formData);
        

        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        try {
            const response = await fetch(`http://${import.meta.env.VITE_VM_IP}:3000/merkator/user/new_route`, {
                method: "POST",
                headers,
                body: formData,
            });

            if (response.ok) {
                // Handle success
                dispatch('add-success');
            } else {
                // Handle error
                errorMessage = "Error uploading route.";
            }
        } catch (error) {
        errorMessage = "An error occurred while uploading the route.";
        }
    };
</script>



<div class="route-upload">
    <h2>Upload Route</h2>
    <p>Select a GPX file to add to your routes</p>
    <form on:submit={handleSubmit}>

        <label class="file-upload-label">
            <input type="file" accept=".gpx" bind:files={selectedFiles} />
            {#if selectedFiles[0]}
            <span class="file-name">{selectedFiles[0].name}</span>
                {:else}Select route GPX file
            {/if}
        </label>
        <label class="route-name">
            Route name:
            <input type="text" bind:value={routeName} />
        </label>
    <button type="submit">Upload</button>
    {#if errorMessage}
        <p class="error">{errorMessage}</p>
    {/if}
    </form>
</div>       

        


<style>
    .route-upload {
        display: flex;
        padding: 10px;
        flex-direction: column;
        align-items: left;
        margin-bottom: 10px;
    }
    .route-name {
        margin-top: 10px;
    }
    .error {
        color: red;
    }
</style>
