<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { initApp, initStorage, initDatabase } from '$lib/firebase.js';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';

    import LandingPage from '$lib/components/dashboard/LandingPage.svelte';
    import Music from '$lib/components/dashboard/Music.svelte';
    import MeetTheBand from '$lib/components/dashboard/MeetTheBand.svelte';
    import Contacts from '$lib/components/dashboard/Contacts.svelte';
    import Settings from '$lib/components/dashboard/Settings.svelte';

    const landing = 'landing';
    const music = 'music';
    const band = 'band';
    const contacts = 'contacts';
    const settings = 'settings';

    let activeTab = $state('landing');
    let isUploading = $state([false, false, false]);
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
        initStorage();
        initDatabase();

        document.title = "Dashboard - Unthynck Members";

        const auth = getAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log(`User authed as ${user.email}`);
                if (user.displayName) {
                    userName = user.displayName;
                } else {
                    userName = user.email.split('@')[0];
                }
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
                class:active={activeTab === 'contacts'}
                onclick={() => changeTab(contacts)}
            >
                Contacts &#128483;
            </button>
            <button
              class="tab-button"
              class:active={activeTab === 'settings'}
              onclick={() => changeTab(settings)}
            >
                Settings &#9881;
            </button>
        </nav>

        <div class="content-area" style:display={activeTab === landing ? '' : 'none'}>
            <LandingPage bind:isUploading={isUploading[0]} />
        </div>

        <div class="content-area" style:display={activeTab === music ? '' : 'none'}>
            <Music bind:isUploading={isUploading[1]} />
        </div>

        <div class="content-area" style:display={activeTab === band ? '' : 'none'}>
            <MeetTheBand uid={userUid} bind:isUploading={isUploading[2]} />
        </div>

        <div class="content-area" style:display={activeTab === contacts ? '' : 'none'}>
            <Contacts />
        </div>

        <div class="content-area" style:display={activeTab === settings ? '' : 'none'}>
            <Settings />
        </div>
    </div>

    <button class="jump" onclick={jumpToTop}>
        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <!-- Sloppy left pointer -->
            <path d="M12 3 L6.8 9.5" />

            <!-- Sloppy right pointer -->
            <path d="M12 3 L17.2 9.3" />

            <!-- Janky stick body with a gentle wiggle -->
            <path d="M12 9 C11.7 12, 12.3 14, 12 18" />
        </svg>
    </button>
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

        background-color: rgba(255, 255, 255, 0.2);
    }

    .tab-button {
        padding: 0.75rem 1.5rem;
        border: none;
        color: var(--text-standard);
        font-family: var(--font-standard);
        font-size: 1.2rem;
        cursor: pointer;
        white-space: nowrap;
        background: none;

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

        text-align: center;
        padding: 0.75rem 0.75rem 0.65rem 0.75rem;
        aspect-ratio: 1/1;
        height: fit-content;
        width: fit-content;

        background-color: var(--secondary-color);
        color: var(--text-standard);
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