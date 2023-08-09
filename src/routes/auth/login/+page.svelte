<script>

    import NavBar from "../../../lib/navBar.svelte";

    /** @type {import('./$types').Actions} */
    export const actions = {
        default: async (event) => {
        // TODO log the user in
        }
    };
</script>

<div>
    <NavBar />
</div>
<form method="POST">
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