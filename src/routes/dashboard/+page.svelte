<script>
    import { onMount } from 'svelte';
    import { initApp } from '$lib/firebase.js';
    import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
    import { getAuthStore } from '$lib/authStore.js';

    let activeTab = $state('landing');
    let landingText = $state('');
    let bandBio = $state('');
    let isUploading = $state(false);

    const handleImageUpload = async (section) => {
        // Left empty for implementation
        // Should handle image upload for landing page or band section
    };

    const handleMusicUpload = async () => {
        // Left empty for implementation
        // Should handle music file upload
    };

    const handleTextUpdate = async (section) => {
        // Left empty for implementation
        // Should handle text updates for landing page or band bio
    };

    onMount(() => {
       initApp();

       const auth = getAuth();
       const user = getAuthStore();

       signInWithEmailAndPassword(auth, user.userCred.user.email, user.password)
         .then((userCred) => {
             alert(`You are authorized as ${userCred.user.email}`);
         })
         .catch((err) => {
             alert("You are not authorized to view this site!");
         });
    });
</script>

<div class="dashboard-container">
    <nav class="tab-navigation">
        <button
                class="tab-button"
                class:active={activeTab === 'landing'}
                onclick={() => activeTab = 'landing'}
        >
            Landing Page
        </button>
        <button
                class="tab-button"
                class:active={activeTab === 'music'}
                onclick={() => activeTab = 'music'}
        >
            Music
        </button>
        <button
                class="tab-button"
                class:active={activeTab === 'band'}
                onclick={() => activeTab = 'band'}
        >
            Meet the Band
        </button>
    </nav>

    <div class="content-area">
        {#if activeTab === 'landing'}
            <div class="section">
                <h2>Landing Page Content</h2>

                <div class="upload-section">
                    <h3>Update Landing Images</h3>
                    <div class="file-upload">
                        <input
                                type="file"
                                accept="image/*"
                                id="landing-image"
                                onchange={() => handleImageUpload('landing')}
                        />
                        <label for="landing-image" class="upload-button">
                            {isUploading ? 'Uploading...' : 'Choose Image'}
                        </label>
                    </div>
                </div>

                <div class="text-section">
                    <h3>Landing Page Text</h3>
                    <textarea
                            bind:value={landingText}
                            placeholder="Enter landing page text..."
                            rows="4"
                    ></textarea>
                    <button
                            class="save-button"
                            onclick={() => handleTextUpdate('landing')}
                    >
                        Save Text
                    </button>
                </div>
            </div>
        {/if}

        {#if activeTab === 'music'}
            <div class="section">
                <h2>Music Management</h2>

                <div class="upload-section">
                    <h3>Upload Music</h3>
                    <div class="file-upload">
                        <input
                                type="file"
                                accept="audio/*"
                                id="music-file"
                                onchange={handleMusicUpload}
                        />
                        <label for="music-file" class="upload-button">
                            {isUploading ? 'Uploading...' : 'Choose Music File'}
                        </label>
                    </div>
                </div>
            </div>
        {/if}

        {#if activeTab === 'band'}
            <div class="section">
                <h2>Band Information</h2>

                <div class="upload-section">
                    <h3>Band Photos</h3>
                    <div class="file-upload">
                        <input
                                type="file"
                                accept="image/*"
                                id="band-image"
                                onchange={() => handleImageUpload('band')}
                        />
                        <label for="band-image" class="upload-button">
                            {isUploading ? 'Uploading...' : 'Choose Image'}
                        </label>
                    </div>
                </div>

                <div class="text-section">
                    <h3>Band Biography</h3>
                    <textarea
                            bind:value={bandBio}
                            placeholder="Enter band biography..."
                            rows="6"
                    ></textarea>
                    <button
                            class="save-button"
                            onclick={() => handleTextUpdate('band')}
                    >
                        Save Biography
                    </button>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .dashboard-container {
        width: 100%;
        max-width: 1200px;
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
        font-family: var(--font-special);
        font-size: 1.1rem;
        cursor: pointer;
        white-space: nowrap;
    }

    .tab-button.active {
        background-color: var(--secondary-color);
        border-radius: 0.375rem 0.375rem 0 0;
    }

    .content-area {
        background-color: var(--primary-color);
        border-radius: 0.5rem;
        padding: 2rem;
    }

    .section {
        margin-bottom: 2rem;
    }

    h2 {
        font-family: var(--font-special);
        color: var(--text-standard);
        font-size: var(--banner-text-size);
        margin-bottom: 1.5rem;
    }

    h3 {
        color: var(--text-standard);
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }

    .upload-section, .text-section {
        margin-bottom: 2rem;
    }

    .file-upload {
        position: relative;
    }

    .file-upload input[type="file"] {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
    }

    .upload-button {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        background-color: var(--secondary-color);
        color: var(--text-standard);
        border-radius: 0.375rem;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .upload-button:hover {
        background-color: var(--banner-accent);
    }

    textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--banner-accent);
        border-radius: 0.375rem;
        background-color: var(--background-secondary);
        color: var(--primary-color);
        font-family: var(--font-standard);
        resize: vertical;
        margin-bottom: 1rem;
    }

    textarea:focus {
        outline: none;
        border-color: var(--secondary-color);
        box-shadow: 0 0 0 2px rgba(122, 42, 191, 0.2);
    }

    .save-button {
        padding: 0.75rem 1.5rem;
        background-color: var(--secondary-color);
        color: var(--text-standard);
        border: none;
        border-radius: 0.375rem;
        cursor: pointer;
        font-family: var(--font-standard);
    }

    .save-button:hover {
        background-color: var(--banner-accent);
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

        h2 {
            font-size: calc(var(--banner-text-size) * 0.8);
        }

        .upload-button, .save-button {
            width: 100%;
            text-align: center;
        }
    }
</style>