<script lang="js">

    let { children } = $props();
</script>

<style lang="css">

    @font-face {
        font-family: 'Unthynck Branding';
        src: url("/fonts/unthynck-branding.ttf") format("truetype");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
    }

    @font-face {
        font-family: 'Unthynck Text';
        src: url("/fonts/unthynck-text.ttf") format("truetype");

    }

    :root {
        --background-standard: url("/backgrounds/standard-background.jpg");
        --background-secondary: #FFFFFF;

        --banner-standard: #000000;
        --banner-accent: #784895;
        --primary-color: #1a1a1a;
        --secondary-color: #7a2abf;

        --link-color: #039be5;

        --text-standard: #FFFFFF;
        --line-height-standard: 1.5rem;
        --font-standard: Unthynck Text, sans-serif;
        --font-special: Unthynck Branding, sans-serif;

        --banner-text-size: 2rem;

        @media only screen and (max-width: 768px) {
            --paragraph-font-size: 1.15rem;
        }

        overflow-x: hidden;
        background-color: #000000;
    }

    :global(html, body) {
        margin: 0;
    }

    main {
        position: relative;
        overflow-x: hidden;
        min-height: 100dvh;
        max-height: fit-content;
    }

    .background {
        position: absolute;

        min-height: 100%;
        width: 100%;

        background-image: var(--background-standard);
        background-repeat: repeat;
        background-position: center top;

        filter: blur(1px);
    }


</style>

<main>
    <div class="background"></div>
    {#if children}
        {@render children()}
    {:else}
        <p>502</p>
    {/if}
</main>