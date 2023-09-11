<script>
    import { invalidateAll, goto } from '$app/navigation';
    import LoadingIcon from '../../../lib/LoadingIcon.svelte';


    let loginMessage;
    let loggingIn = false;


    async function handleSubmit(event) {
        loggingIn = true;
        event.preventDefault();
        
        const formData = {
            email: event.target.email.value,
            password: event.target.password.value
        };
        
        try{
            const response = await fetch("http://localhost:3000/merkator/api/v1/auth/authenticate", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.token) {
                // Store the JWT in local storage
                localStorage.setItem('token', result.token);

                // rerun all `load` functions, following the successful update
                await invalidateAll();
                goto("/"); // Redirect to home page after registration
                console.log("redirected")
                loggingIn = false;
            } else {
                // Handle login failure
                console.log("unsuccessful")
                loginMessage = 'Log in attempt unsuccessful, please check your credentials and try again.';
                loggingIn = false;
            }
        } catch (error) {
            console.error(error);
            loginMessage = 'Server error, please refresh the page and try again.';
            loggingIn = false;
        }
    }
</script>

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
    {#if loggingIn}
        <div class="loading-container">
            <LoadingIcon />
            <p>Logging in . . .</p>
        </div>
    {/if}
    {#if loginMessage}
    <br>
    <div class="error-message">{loginMessage}</div>
    {/if}
</div>

<style>
    .login {
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

    .login form {
        width: 100%;
    }

    .login label {
        display: block;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .login input {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border: 1px solid rgba(38, 214, 150, 0.2);
        border-radius: 3px;
    }

    .login button {
        border: none;
        padding: 10px 15px;
        border-radius: 3px;
        cursor: pointer;
        display: block;
        margin: 0 auto;
        /* border: 1px solid rgba(38, 214, 150, 0.2); */
    }
    .login button:hover {
        background-color: rgba(38, 214, 150, 0.2);
	    border-color: rgba(38, 214, 150, 0.2);
    }
    .error-message {
        color: crimson;
    }
</style>