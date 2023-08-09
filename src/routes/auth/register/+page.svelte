<script>

    import { invalidateAll, goto } from '$app/navigation';
    import { applyAction, deserialize } from '$app/forms';

    import NavBar from "../../../lib/navBar.svelte";

    /** @type {import('./$types').ActionData} */
    let form;

    /** @type {any} */
    let error;

    async function handleSubmit(event) {
        const data = new FormData(this);
        console.log(data)

        const response = await fetch("http://localhost:3000/merkator/api/v1/auth/register", {
            method: 'POST',
            body: data
        });

        /** @type {import('@sveltejs/kit').ActionResult} */
        const result = deserialize(await response.text());

        if (result.type === 'success') {
            // rerun all `load` functions, following the successful update
            await invalidateAll();
        }

        applyAction(result);
    }
</script>

<div>
    <NavBar />
</div>

<form method="POST" on:submit|preventDefault={handleSubmit}>
    <label>
        Name
        <input name="name" type="text">
    </label>
    <label>
        Email
        <input name="email" type="email">
    </label>
    <label>
        Password
        <input name="password" type="password">
    </label>
    <button>Register</button>
</form>