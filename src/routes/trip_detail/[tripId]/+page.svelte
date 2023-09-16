<!-- Page to show details of a planned trip -->


<script>
    import { page } from '$app/stores';
    import TripDetail from '../../../lib/TripDetail.svelte'
    import { userTrips } from '../../../stores'; // Import your userRoutes store

    // Get the route ID from the route parameter
    let tripId = $page.params.tripId;

    // Find the route with the matching ID in the userRoutes store
    let trip = $userTrips.find(t => t.idString === tripId);
</script>

<TripDetail {trip} {tripId}/>