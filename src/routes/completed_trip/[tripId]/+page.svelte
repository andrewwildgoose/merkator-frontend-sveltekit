<!-- Page to show details of a completed trip -->

<script>
    import CompletedTripDetail from '../../../lib/CompletedTripDetail.svelte';
    import { page } from '$app/stores';

    let completedTripId = $page.params.tripId;
    
</script>

<CompletedTripDetail {completedTripId} />