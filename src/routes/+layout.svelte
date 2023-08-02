<script>
    import Title from '$lib/title.svelte'
    import '../styles/global.css'
</script>

<header>
    <Title />
</header>
<main>
    <slot></slot>
</main>
<footer>
    <p>thanks for using merkator</p>
</footer>

<style>
    header {
        display: flex;
        justify-content: center;
    }
    main {
        max-width: 960px;
        margin: 20px auto;
    }
    footer {
        text-align: center;
    }
    p {
        color: #666;
    }
</style>