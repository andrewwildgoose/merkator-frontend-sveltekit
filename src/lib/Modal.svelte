<script>
    import Card from "./card.svelte";

    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    function handleSuccess() {
        console.log("Modal: success event dispatched")
        dispatch('add-success');
    }

    function closeModal() {
        console.log("Modal: Closing modal");
        dispatch('close');
    }
    function handleKeyUp(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }
</script>

<div class='modal' on:click|self={closeModal} on:keydown={handleKeyUp} on:add-success={handleSuccess} on:close={closeModal} on:upload-success{handleSuccess}>
    <div class='content'>
        <Card>
            <slot></slot>  
        </Card>
        <div class="button-container">
            <button on:click={closeModal}>Close</button>
        </div>
    </div>
</div>

<style>
    .modal {
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
    }
    .content {
        position: sticky;
        display: flex;
        flex-direction: column;
        background-color: black;
        padding: 20px;
        border-radius: 2px;
        border: 1px solid rgba(38, 214, 150, 0.5);
        box-shadow: 2px 4px 6px rgba(38, 214, 150, 0.1);
        margin: 10px;
        max-height: 80vh;
        max-width: fit-content;
        overflow-y: auto;
    }
    .button-container {
        align-self: center;
        text-align: right;
        margin-top: 10px;
        width: 90%;
    }

    .button-container button {
        align-self: right;
        max-width: fit-content;
        cursor: pointer;
    }
</style>
