<script>
    import { invalidateAll, goto } from '$app/navigation';
    import { applyAction } from '$app/forms';

    import NavBar from "../../../lib/navBar.svelte";

    async function handleSubmit(event) {
        event.preventDefault();

        const formData = {
            name: event.target.name.value,
            email: event.target.email.value,
            password: event.target.password.value
        };

        const response = await fetch("http://localhost:3000/merkator/api/v1/auth/register", {
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
            goto("/"); // Redirect to home page after registration
            console.log("redirected")
        } else {
            // Handle registration failure
            console.log("unsuccessful")
            applyAction(result);
        }
    }
</script>

<div class="register">
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
</div>

<style>
    .register  {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
        padding: 20px;
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .register  form {
        width: 100%;
    }

    .register  label {
        display: block;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .register  input {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid rgba(38, 214, 150, 0.2);
        border-radius: 3px;
    }

    .register  button {
        border: none;
        padding: 10px 15px;
        border-radius: 3px;
        cursor: pointer;
        display: block;
        margin: 0 auto;
        border: 1px solid rgba(38, 214, 150, 0.2);
    }
    .register  button:hover {
        background-color: rgba(38, 214, 150, 0.2);
	    border-color: rgba(38, 214, 150, 0.2);
    }
</style>