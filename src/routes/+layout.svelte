<script lang="js">
    import { onMount } from 'svelte';

    let { children } = $props();

    let isMobile = $state(false);

    //Stolen from Claude? Perhaps. But I understand it and didn't want to write it all out
    //creates a query, then an event listener to change when updated
    //I may be able to just do this from $derived, but eh this works
    function setupMediaListeners() {
        const mobileQuery = window.matchMedia('(max-width: 768px)');

        // Set initial values
        isMobile = mobileQuery.matches;

        const updateMobile = (e) => isMobile = e.matches;
        // Add listeners
        mobileQuery.addEventListener('change', updateMobile);

        // Return cleanup function
        return () => {
            mobileQuery.removeEventListener('change', updateMobile);
        };
    }


    onMount(() => {
        const cleanup = setupMediaListeners();
        return cleanup;
    });
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
        background-image: url("/backgrounds/standard-background.jpg");
        background-repeat: repeat;
        background-size: initial;
        overflow-x: hidden;
        min-height: 100vh;
        max-height: fit-content;
    }

</style>

<main>
    {#if children}
        {@render children()}
    {:else}
        <p>502</p>
    {/if}
</main>