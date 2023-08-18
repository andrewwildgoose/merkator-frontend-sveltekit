<script>

    let showModal = false;

    const openModal = () => {
        showModal = true;
    };

    const closeModal = () => {
        showModal = false;
    };
    
    let selectedFiles = [];
    let routeName = '';
    let errorMessage = '';

    const handleSubmit = async (event) => {
        event.preventDefault();

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
            const response = await fetch("http://localhost:3000/merkator/user/new_route", {
                method: "POST",
                headers,
                body: formData,
            });

            if (response.ok) {
                // Handle success
                closeModal();
            } else {
                // Handle error
                errorMessage = "Error uploading route.";
            }
        } catch (error) {
        errorMessage = "An error occurred while uploading the route.";
        }
        };
</script>


<main>
    <button on:click={openModal}>Upload Route</button>
        {#if showModal}
        <div class="modal">
            <div class="modal-content">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <span class="close" on:click={closeModal}>&times;</span>
                <h2>Upload Route</h2>
                <form on:submit={handleSubmit}>
                    <label>
                        Upload Route GPX File:
                        <input type="file" accept=".gpx" bind:files={selectedFiles} />
                    </label>
                    <label>
                        Route Name:
                        <input type="text" bind:value={routeName} />
                    </label>
                <button type="submit">Upload</button>
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
