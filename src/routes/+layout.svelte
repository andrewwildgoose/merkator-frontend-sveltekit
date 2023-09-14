<script>
    import NavBar from '../lib/NavBar.svelte';
    import '../styles/global.css';

    
</script>

<header>
    <NavBar />
</header>
<main>
    <slot></slot>
</main>
<footer>
    <p>thanks for using merkator</p>
</footer>

<style>
    header {
        margin: 0;
        padding: 0;
    }

    main {
        max-width: 80%;
        margin: 5px auto;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 150px);
    }
    footer {
        text-align: center;
        height: 50px;
    }
    p {
        color: #666;
    }
</style>