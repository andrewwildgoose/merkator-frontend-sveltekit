<script>
	export let modalContent;
    export let tripID;
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div on:click|self class='modal'>
	<div class='content'>
		<svelte:component on:click this={modalContent} tripID={tripID}/>
	</div>
</div>

<style>
    .modal {
        display: block;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
</style>