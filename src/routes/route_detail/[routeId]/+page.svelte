<script>
    import { page } from '$app/stores';
    import RouteDetail from '../../../lib/RouteDetail.svelte'
    import { userRoutes } from '../../../stores'; // Import your userRoutes store

    // Get the route ID from the route parameter
    let routeId = $page.params.routeId;

    // Find the route with the matching ID in the userRoutes store
    let route = $userRoutes.find(r => r.idString === routeId);
    console.log(route);
</script>

<RouteDetail {route} />
