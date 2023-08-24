<script>
    import { onMount } from 'svelte';

    export let tripId;
    let token;
    let loading = true;
    let routeMapping = []; // Array of route IDs, names, and file information associated with the trip
    let errorMessage;

    onMount(() => {
        token = localStorage.getItem('token');

        fetchRouteMappings(tripId);
    });

    const fetchRouteMappings = async () => {
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await fetch(`http://localhost:3000/merkator/user/trip/route_mappings?tripId=${tripId}`, {
                method: "GET",
                headers,
            });

            if (response.ok) {
                routeMapping = await response.json();
                // Initialize the routeMapping array with selected and fileName properties
                routeMapping.forEach(route => {
                    route.selected = false;
                    route.fileName = '';
                });
                console.log(routeMapping);
            } else {
                errorMessage = 'Failed to fetch route mappings';
                console.error(errorMessage);
            }
        } finally {
            loading = false; // Set loading to false once data is fetched
        }
    }

    const handleFileInput = (event, routeIndex) => {
        const file = event.target.files[0];
        if (file) {
            routeMapping[routeIndex].selected = true;
            routeMapping[routeIndex].fileName = file.name;
        }
    };

    const uploadFiles = async () => {
        const selectedRoutes = routeMapping.filter(route => route.selected);

        if (selectedRoutes.length === 0) {
            return;
        }

        const formData = new FormData();
        formData.append('tripId', tripId);

        selectedRoutes.forEach(({ routeId, file }) => {
            formData.append('routeIds[]', routeId);
            formData.append('files', file);
        });

        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        try {
            const response = await fetch("http://localhost:3000/merkator/user/complete_trip", {
                method: "POST",
                headers,
                body: formData,
            });

            if (response.ok) {
                // Handle success
                const uploadSuccessEvent = new CustomEvent('upload-success');
                dispatch(uploadSuccessEvent);
            } else {
                // Handle error
                errorMessage = "Error uploading route.";
            }
        } catch (error) {
            errorMessage = "An error occurred while uploading the route.";
        }
    };
</script>

<div>
    {#if loading}
        <p>Loading trips . . .</p>
    {:else if routeMapping !== undefined && routeMapping.length > 0}
        <h2>Select routes to complete</h2>
        <p>Upload completed activity files (.gpx) for the routes you have completed on this trip</p>
        {#each routeMapping as route, i}
            <div class="route-item">
                <label class="file-upload-label">
                    <p>{route.routeName}</p>
                    <input type="file" accept=".gpx" on:change={e => handleFileInput(e, i)} class="file-upload-input"/>
                    
                    {#if route.selected}
                        <span class="file-name"><p>{route.fileName}</p></span>
                        {:else}
                            <span class="button">Upload Route File</span>
                    {/if} 
                </label>
                    
            </div>
        {/each}
        <div class="button-container">
            <button on:click={uploadFiles}>Upload Files</button>
        </div>
    {:else}
        <p>{$errorMessage}</p>
    {/if}
</div>

<style>
    .route-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        width: 100%;
    }
    .button-container {
        display: flex;
        justify-content: center; /* Align items to the right */
        margin-top: 10px;
    }
</style>