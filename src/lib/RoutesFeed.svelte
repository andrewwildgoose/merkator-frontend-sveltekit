<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { units, deleteRoute, userRoutes } from '../stores';
    import Card from './card.svelte';
    import UploadFile from './UploadFile.svelte';
    import StaticMap from './StaticMap.svelte';
    import Modal from './Modal.svelte';

    let routesStore;
    let token;
    let loading = true;
    let isUploadModalOpen = false;

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

        fetchUserRoutes(headers);
    
    });

    const fetchUserRoutes = async (headers) => {
        console.log("Fetching User Routes");
        try {
            // Fetch user's routes from the backend
            const response = await fetch('http://localhost:3000/merkator/user/routes', { headers });
            if (response.ok) {
                routesStore = await response.json();
                userRoutes.set(routesStore); // Update the store
                console.log("User routes updated:", routesStore);
            } else {
                // Handle error, e.g., unauthorized
                console.error('Failed to fetch user routes');
            }
        } finally {
            loading = false; // Set loading to false once data is fetched
        }
    };

    const handleSuccess = (token) => {
        // Fetch user's routes again to refresh the data
        console.log("User routes updated, handling success");
        const headers = {
            'Authorization': `Bearer ${token}`
        };
        fetchUserRoutes(headers);
    }

    //handle click on the delete route button
    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this route?')) {
            const response = await deleteRoute(id, token);
            console.log(response);
            if (response.ok) {
                handleSuccess(token)
            }
        }
    };

    const openUploadModal = () => {
        console.log("RF: Opening upload modal")
        isUploadModalOpen = true;
    };

    const closeUploadModal = () => {
        console.log("RF: Closing upload modal");
        isUploadModalOpen = false;
    };

    const handleUploadSuccess = () => {
        console.log("RF: Handling upload success");
        closeUploadModal();
        handleSuccess(token);
    };
    
</script>

<div class="routesListFeed">
    <h1>Routes</h1>
    <Card>
        <button on:click={openUploadModal}>Upload Route</button>
    </Card>
    
    {#if loading}
        <p>Loading routes . . .</p>
    {:else if routesStore !== undefined && routesStore.length > 0}
        {#each routesStore as route (route.id)}
            <div class='route-item'>
                <div class='map-container'>
                    <StaticMap mapUrl={route.routeStaticMapUrl}/>
                </div>
                <div class='route-details'>
                    <h4>{route.routeName}</h4>
                    <p>
                        Distance: {route.routeLength} {$units}
                        <br>
                        Elevation gain: {route.routeElevationGain} m
                        <br>
                        Elevation loss: {route.routeElevationLoss} m
                        <br>
                        {#if route.routeDescription !== "Optional.empty"}{route.routeDescription}{/if}
                    </p>
                    <button on:click={() => handleDelete(route.idString)}>Delete route</button>
                </div>
            </div>
            <br>
        {/each}
    {:else}
        <p>There are no routes to show, upload a route!</p>
    {/if}
    {#if isUploadModalOpen}
        <Modal on:close={closeUploadModal}>
            <UploadFile on:add-success={() => {
                console.log("RF: Handling upload success");
                handleUploadSuccess();
            }}/>
        </Modal>
    {/if}
</div>


<style>
    .routesListFeed {
        
        gap: 20px;
    }

    .route-item {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 10px;
        background: rgba(0, 0, 0, 0.1);
        padding: 10px;
        border-radius: 2px;
        box-shadow: 2px 4px 6px rgba(38, 214, 149, 0.192);
        margin: 10px;
    }

    .map-container {
        width: 160px;
        height: 160px; 
    }

    .route-details {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>