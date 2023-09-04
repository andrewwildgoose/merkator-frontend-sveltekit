<script>
    export let mapUrl;
</script>

<img class="small-map-box" src={mapUrl} alt="route map">

<style>
        .small-map-box {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
</style>