<script>
    import Title from '$lib/title.svelte'
</script>

<div class="nav-bar">
    <div class="title">
        <Title />
    </div>
    <div class="nav-buttons">
        <a href="/">home</a>
        <a href="/user">user home</a>
        <a href="/auth/login">log in</a>
        <a href="/auth/register">register</a>
    </div> 
</div>

<style>
    .nav-bar {
        display: flex;
        justify-content: space-between; /* Align title to the left and buttons to the right */
        align-items: center; /* Center vertically within the nav bar */
        padding: 10px 20px;
        background-color: rgba(38, 214, 150, 0.1);
    }

    .title {
        text-align: left;
        margin: 0;
        padding: 0;
    }

    .nav-buttons a {
        display: inline-block;
        padding: 10px 20px;
        border-radius: 2px;
        margin-right: 20px;
        text-decoration: none;
        color: #26D696;
    }
    .nav-buttons a:hover {
        background-color: rgba(38, 214, 150, 0.1);
    }


    .nav-buttons a::before {
        content: "";
        position: absolute;
        right: 0;
        top: 0%;
        transform: translateY(-50%);
        width: 1px;
        height: 80%;
    }
</style>