<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { units, deleteRoute, userRoutes } from '../stores';
    import Card from './card.svelte';
    import UploadFile from './UploadFile.svelte';
    import StaticMap from './StaticMap.svelte';
    import Modal from './Modal.svelte';
    import LoadingIcon from './LoadingIcon.svelte';

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
        loading = true;
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
    <Card>
        <div class="card-content">
            <h2 class="card-title">Routes</h2>
            <button on:click={openUploadModal}>Upload Route</button>
        </div>
    </Card>
    
    {#if loading}
        <div class="loading-container">
            <LoadingIcon />
            <p>Loading routes . . .</p>
        </div>
    {:else if routesStore !== undefined && routesStore.length > 0}
        {#each routesStore.slice().reverse() as route (route.id)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div class='route-item' on:click={goto(`/route_detail/${route.idString}`)}>
                <div class='inner-item'>
                    <div class='map-container'>
                        <StaticMap mapUrl={route.routeStaticMapUrl}/>
                    </div>
                    <div class='route-details'>
                        <h4>{route.routeName}</h4>
                        <p>
                            Distance: <p2>{route.routeLength} {$units}</p2>
                            <br>
                            Elevation gain: <p2>{route.routeElevationGain} m</p2>
                            <br>
                            Elevation loss: <p2>{route.routeElevationLoss} m</p2>
                            <br>
                            {#if route.routeDescription !== "Optional.empty"} Description: {route.routeDescription}{/if}  
                        </p>                      
                    </div>
                </div>
                <div class="button-container">
                    <button on:click={goto(`/route_detail/${route.idString}`)}>View route</button>
                    <button on:click={(event) => {event.stopPropagation(); handleDelete(route.idString);}}>Delete route</button>
                </div>
            </div>
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
    .card-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
    }
    .card-title {
        flex-grow: 1;
        text-align: left;
        margin-right: auto;
    }

    .card-content button {
        flex-shrink: 0;
        width: 60%;
        margin-left: auto;
    }

    .routesListFeed {
        gap: 20px;
    }

    .route-item {
        gap: 10px;
        background: rgba(0, 0, 0, 0.1);
        padding: 5px;
        border-radius: 2px;
        box-shadow: 2px 4px 6px rgba(38, 214, 149, 0.1);
        margin: 5px;
        cursor: pointer;
    }

    .route-item:hover {
        background: rgba(38, 214, 149, 0.1);
    }


    .inner-item {
        display: flex;
        align-items: center;
        padding: 2px;
        margin: 5px;
    }

    .button-container {
        padding: 2px;
        margin: 5px;
    }

    .route-item button {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        border: none;
        border-radius: 2px;
        cursor: pointer;
    }

    .map-container {
        width: 150px;
        height: 150px;
        overflow: hidden;
        padding-right: 5px;
    }

    .route-details {
        flex-grow: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-left: 5px;
    }
</style>