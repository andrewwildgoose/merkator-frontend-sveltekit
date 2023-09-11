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
    main {
        max-width: 80%;
        margin: 20px auto;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: calc(100vh - 100px);
    }
    footer {
        text-align: center;
        height: 100px;
    }
    p {
        color: #666;
    }
</style>