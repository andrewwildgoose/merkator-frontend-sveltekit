<script>
    import { invalidateAll, goto } from '$app/navigation';
    import { applyAction} from '$app/forms';

    import NavBar from "../../../lib/navBar.svelte";

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = {
            email: event.target.email.value,
            password: event.target.password.value
        };
        console.log(JSON.stringify(formData))

        const response = await fetch("http://localhost:3000/merkator/api/v1/auth/authenticate", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();
        console.log(result)

        if (result.token) {
            console.log("success!")
            // Store the JWT in local storage
            localStorage.setItem('token', result.token);
            console.log("token saved to local storage: ", result.token)

            // rerun all `load` functions, following the successful update
            await invalidateAll();
            goto("/user"); // Redirect to a success page after registration
            console.log("redirected")
        } else {
            // Handle registration failure
            console.log("unsuccessful")
            applyAction(result);
        }
    }
</script>

<div>
    <NavBar />
</div>

<div class="login">
    <form method="POST" on:submit|preventDefault={handleSubmit}>
        <label>
            Email
            <input name="email" type="email">
        </label>
        <label>
            Password
            <input name="password" type="password">
        </label>
        <button>Log in</button>
    </form>
</div>

<style>
        .login {
        text-align: center;
        display: block;
        margin: 20px auto;
    }
</style>