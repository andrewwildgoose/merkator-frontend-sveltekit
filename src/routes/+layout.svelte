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
        max-width: 960px;
        margin: 20px auto;
        display: flex;
        justify-content: center;
    }
    footer {
        text-align: center;
    }
    p {
        color: #666;
    }
</style>