<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { initApp } from '$lib/firebase.js';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';

    import LandingPage from '$lib/components/dashboard/LandingPage.svelte';
    import Music from '$lib/components/dashboard/Music.svelte';
    import MeetTheBand from '$lib/components/dashboard/MeetTheBand.svelte';

    const landing = 'landing';
    const music = 'music';
    const band = 'band';
    const settings = 'settings';

    let activeTab = $state('landing');
    let isUploading = $state(false);
    let authed = $state(false);
    let userName = $state("");

    let userUid = $state();

    let top = $state();

    function changeTab(newTab) {
        activeTab = newTab;
    }

    function jumpToTop(e) {
        e.preventDefault();

        top.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }

    onMount(() => {
        initApp();

        const auth = getAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(`User authed as ${user.email}`);
                userName = user.email.split('@')[0];
                authed = true;
                userUid = user.uid;
            } else {
                console.log(`User not authed because of one error or another`);
                goto('/login');
            }
       });

        top = document.getElementById('top');

    });
</script>
<section class="dashboard">
    <div class="welcome-message" id="top">
        {#if authed}
            <h1>Welcome, {userName}</h1>
        {:else}
            <h1>You are not authenticated! No changes to your profile will be saved!</h1>
        {/if}
    </div>
    <div class="dashboard-container">
        <nav class="tab-navigation">
            <button
              class="tab-button"
              class:active={activeTab === 'landing'}
              onclick={() => changeTab(landing)}
            >
                Landing Page &#128075;
            </button>
            <button
              class="tab-button"
              class:active={activeTab === 'music'}
              onclick={() => changeTab(music)}
            >
                Music &#127911;
            </button>
            <button
              class="tab-button"
              class:active={activeTab === 'band'}
              onclick={() => changeTab(band)}
            >
                Meet the Band &#128248;
            </button>
            <button
              class="tab-button"
              class:active={activeTab === 'settings'}
              onclick={() => changeTab(settings)}
            >
                Settings &#9881;
            </button>
        </nav>

        {#if activeTab === 'landing'}
            <div class="content-area">
                <LandingPage bind:isUploading={isUploading} />
            </div>
        {/if}

        {#if activeTab === 'music'}
            <div class="content-area">
                <Music bind:isUploading={isUploading} />
            </div>
        {/if}

        {#if activeTab === 'band'}
            <div class="content-area">
                <MeetTheBand uid={userUid}/>
            </div>
        {/if}
    </div>

    <button class="jump" onclick={jumpToTop}>&uarr;</button>
</section>

<style>
    @keyframes slide-in {
        from { transform: translateY(100dvh) }
        to { transform: translateX(0) }
    }

    .dashboard {
        position: relative;
        display: flex;
        flex-direction: column;

        min-height: 80dvh;
        width: 100dvw;

        align-items: center;
    }

    .welcome-message {
        position: relative;
        height: fit-content;
        width: 95%;

        text-align: left;
    }

    .welcome-message h1 {
        font-family: var(--font-special);
        color: var(--text-standard);
        font-size: 3rem;
        margin-bottom: 1.5rem;
    }

    .dashboard-container {
        position: relative;
        height: fit-content;
        width: 95%;
        margin: 0 auto;
        padding: 1rem;
        font-family: var(--font-standard);
    }

    .tab-navigation {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        border-bottom: 2px solid var(--banner-accent);
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .tab-button {
        padding: 0.75rem 1.5rem;
        background: none;
        border: none;
        color: var(--text-standard);
        font-family: var(--font-standard);
        font-size: 1.2rem;
        cursor: pointer;
        white-space: nowrap;

        transition: background-color 200ms ease;
    }

    .tab-button.active {
        background-color: var(--secondary-color);
        border-radius: 0;
    }

    .content-area {
        background-color: var(--primary-color);
        border-radius: 0;

        animation: slide-in 400ms ease;
    }

    .jump {
        position: fixed;

        bottom: 2.5%;
        right: 2.5%;

        height: 3rem;
        width: 3rem;

        text-align: center;
        aspect-ratio: 1 / 1;

        background-color: var(--secondary-color);
        color: var(--text-standard);
        font-size: 1.5rem;
        border: none;
        box-shadow: 0 0 0 2px rgba(122, 42, 191, 0.2);

        transition: 100ms ease;
    }

    .jump:hover {
        background-color: var(--banner-accent);
    }

    .jump:active {
        background-color: var(--banner-accent);
        transform: scale(0.95);
    }

    @media only screen and (max-width: 768px) {
        .dashboard-container {
            padding: 0.5rem;
        }

        .content-area {
            padding: 1rem;
        }

        .tab-button {
            padding: 0.5rem 1rem;
            font-size: 1rem;
        }
    }
</style>