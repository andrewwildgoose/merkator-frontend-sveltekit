<script>
    import Title from '$lib/title.svelte'
    import { onMount } from 'svelte';
    import logo from '$lib/assets/Merkator-logo-1.png';

    onMount(() => {
        // Add click event listeners to all anchor (a) elements with the "refresh-link" class
        const refreshLinks = document.querySelectorAll('.refresh-link');

        refreshLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                const currentUrl = window.location.href;
                const linkUrl = event.currentTarget.href;

                // Check if the link URL matches the current URL
                if (linkUrl === currentUrl) {
                    window.location.reload(); // Force a page reload
                    event.preventDefault(); // Prevent the default link behavior
                }
            });
        });
    });
</script>

<div class="nav-bar">
    <div class="title">
        <div class="image-container">
            <img src={logo} alt="logo">
        </div>
        <Title />
    </div>
    <div class="nav-buttons">
        <a href="/" class="refresh-link">home</a>
        <a href="/auth/login" class="refresh-link">log in</a>
        <a href="/auth/register" class="refresh-link">register</a>
    </div> 
</div>

<style>
    .nav-bar {
        display: flex;
        justify-content: space-between; /* Align title to the left and buttons to the right */
        align-items: center; /* Center vertically within the nav bar */
        padding: 0px 0px;
        background-color: rgba(38, 214, 150, 0.1);
    }

    .title {
        display: flex;
        align-items: center;
        text-align: left;
        margin: 0;
        padding: 0;
    }

    .image-container {
        margin: 0;
    }
    .image-container img {
        width: 100px; /* Set the width of the image */
        height: 100px; /* Set the height of the image */
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