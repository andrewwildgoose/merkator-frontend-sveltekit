<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import LoadingIcon from './LoadingIcon.svelte';

    export let tripId;
    let token;
    let loading = true;
    let routeMapping = []; // Array of route IDs, names, and file information associated with the trip
    let errorMessage;
    let completingTrip = false;

    onMount(() => {
        token = localStorage.getItem('token');

        fetchRouteMappings(tripId);
    });

    const fetchRouteMappings = async () => {
        const headers = {
            'Authorization': `Bearer ${token}`
        };

        try {
            const response = await fetch(`http://${import.meta.env.VITE_VM_IP}:3000/merkator/user/trip/route_mappings?tripId=${tripId}`, {
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
            } else {
                errorMessage = 'Failed to fetch route mappings';
            }
        } finally {
            loading = false;
        }
    }

    const handleFileInput = (event, routeIndex) => {
        const file = event.target.files[0];
        if (file) {
            routeMapping[routeIndex].selected = true;
            routeMapping[routeIndex].fileName = file.name;
            routeMapping[routeIndex].file = file;
        }
    };

    const uploadFiles = async () => {
        completingTrip = true;
        const selectedRoutes = routeMapping.filter(route => route.selected);

        if (selectedRoutes.length === 0) {
            return;
        }

        const formData = new FormData();
        formData.append('tripId', tripId);

        selectedRoutes.forEach(({ routeId, file }) => {
            formData.append('routeId', routeId);
            formData.append('file', file);
        });

        const headers = {
            'Authorization': `Bearer ${token}`,
        };

        try {
            const response = await fetch(`http://${import.meta.env.VITE_VM_IP}:3000/merkator/user/complete_trip`, {
                method: "POST",
                headers,
                body: formData,
            });

            if (response.ok) {
                const completedTripId = await response.text();
                completingTrip = false;
                goto(`/completed_trip/${completedTripId}`)
            } else {
                errorMessage = "Error uploading route.";
            }
        } catch (error) {
            errorMessage = "An error occurred while uploading the route.";
        }
    };
</script>

<div class="complete-trip">
    {#if loading}
    <div class="loading-container">
        <LoadingIcon />
        <p>Loading routes . . .</p>
    </div>
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
    {#if completingTrip}
    <div class="loading-container">
        <LoadingIcon />
        <p2>
            Congratulations on your progress.
            <br>
            Completing routes . . . this might take a minute
        </p2>
    </div>
    {:else if errorMessage}
        <p>{$errorMessage}</p>
    {/if}
</div>

<style>
    .complete-trip {
        padding: 10px;
    }
    .route-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        width: 100%;
    }
    .file-name {
        color: #26D696; 
        background-color: rgba(38, 214, 149, 0.1);
        padding-left: 5px;
        padding-right: 5px;
        border-radius: 2px;
        overflow: hidden;
    }
    .button-container {
        display: flex;
        justify-content: center;
        margin-top: 10px;
    }
    .loading-container {
        display: flex;
        align-items: center;
        justify-content: center;
        /* position: fixed; */
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>