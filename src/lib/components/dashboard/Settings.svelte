<script lang="js">
	import { getAuth, updatePassword, signOut, updateProfile, onAuthStateChanged } from 'firebase/auth';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { IconLinks } from '$lib/index.js';

	let auth = $state();

	let currentDisplayName = $state("");
	let name = $state("");
	let password = $state("");

	let showPassword = $state();

	let currentlyUpdating = $state([false, false]); //First is name, second is password
	let loadingModelSize = $state(40);

	async function signOutUser(e) {
		e.preventDefault();

		await signOut(auth).then(() => {
			goto('/login');
		});
	}

	async function updateUserPassword(e) {
		e.preventDefault();

		if (password.length === 0) {
			return;
		}

		if (auth.currentUser) {
			currentlyUpdating[1] = true;
			await updatePassword(auth.currentUser, password).then(() => {
				currentlyUpdating[1] = false;
				goto('/login');
			}).catch((e) => {
				alert(`Failed to update user password: ${e}`);
				currentlyUpdating[1] = false;
			});
		}
	}

	function toggleViewPassword(e) {
		e.preventDefault();

		showPassword = !showPassword;
	}

	async function updateName(e) {
		e.preventDefault();

		if (name === currentDisplayName) {
			return;
		}

		if (auth.currentUser) {
			currentlyUpdating[0] = true;
			await updateProfile(auth.currentUser, {
				displayName: name
			}).then(() => {
				currentlyUpdating[0] = false;
			}).catch((err) => {
				alert(`Failed to update user's name: ${e}`);
				currentlyUpdating[0] = false;
			});
		}
	}

	onMount(() => {
		auth = getAuth();

		onAuthStateChanged(auth, (user) => {
			if (user) {
				currentDisplayName = user.displayName;
			} else {
				currentDisplayName = "No user found";
			}
		});

		const button = document.querySelector('.save-button');
		if (button.offsetHeight !== 0) {
			loadingModelSize = button.offsetHeight;
		}
	});

</script>
<style lang="css">

    h2 {
        font-size: 2rem;
    }

    .settings {
        position: relative;
        display: flex;
        flex-direction: column;

        height: fit-content;
        width: 95dvw;

        justify-content: center;
        align-items: center;
        gap: 1rem;
        color: whitesmoke;
    }

    .input-section {
        position: relative;
				display: flex;
				flex-direction: row;

        height: fit-content;
        width: 95%;

        align-items: center;
				gap: 1rem;
    }

    .save-button {
        width: 25%;

        padding: 0.75rem 1.5rem;
        background-color: var(--secondary-color);
        color: var(--text-standard);
        border: none;
        border-radius: 0;
        cursor: pointer;
        font-family: var(--font-standard);
        font-size: 1rem;

        transition: 100ms ease;
    }

		.save-button:active {
				transform: scale(0.95);
		}

		.save-button:hover {
				background-color: var(--banner-accent);
		}

    .text-input-label {
        width: 15%;
        padding: 0.75rem 0.75rem 0.75rem 0;
        font-family: var(--font-standard);
        color: var(--text-standard);
        font-size: 1.25rem;
        text-align: left;
    }

		.view-password-button {
				position: absolute;

				left: 50%;

				background: none;
				border: none;
				cursor: pointer;
				z-index: 5;
		}

		.view-password-button img {
				object-fit: contain;
		}

    .input-section input[type="text"], .input-section input[type="password"] {
        position: relative;
        width: 35%;
        padding: 0.5rem;
        border: 1px solid var(--banner-accent);
        border-radius: 0;
        background-color: var(--background-secondary);
        color: var(--primary-color);
        font-family: var(--font-standard);
        resize: vertical;
        font-size: 1.25rem;
				z-index: 3;
    }

		.loading-model {
				position: relative;

				animation: rotate 2s infinite linear;
		}

		.loading-model img {
				height: 100%;
				width: 100%;
				object-fit: contain;

				aspect-ratio: 1 / 1;
		}

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
<div class="settings">
	<h2>Settings</h2>

	<div class="input-section" style:margin-bottom="1rem" id="input-section">
		<p style="font-size: 1.25rem;">Signed in as {currentDisplayName}</p>
		<button class="save-button" onclick={signOutUser}>
			Sign Out
		</button>
	</div>

	<div class="input-section" id="input-section">
		<label for="update-name" class="text-input-label">Update User Name: </label>
		<input id="update-name"
					 type="text"
					 placeholder={currentDisplayName}
					 bind:value={name} />

		<button class="save-button" onclick={updateName}>
			Update User Name
		</button>
		<div class="loading-model" style:visibility={currentlyUpdating[0] ? 'visible' : 'hidden'} style:height="{loadingModelSize}px" style:width="{loadingModelSize}px">
			<img src={IconLinks.loader} alt="Loading Icon"/>
		</div>
	</div>

	<div class="input-section" style:margin-bottom="2rem" id="input-section">
		<button class="view-password-button" onclick={toggleViewPassword} style:height="{Math.floor(loadingModelSize*0.75)}px" style:width="{loadingModelSize}px"><img class="view-password-image" src={showPassword ? IconLinks.eyeOn : IconLinks.eyeOff} alt="View Password" style:height="{Math.floor(loadingModelSize*0.75)}px" style:width="{loadingModelSize}px"></button>
		<label for="update-password" class="text-input-label">Update Password: </label>
		<input id="update-password"
					 type={showPassword ? 'text' : 'password'}
					 bind:value={password}
		 />
		<button class="save-button" onclick={updateUserPassword}>
			Update Password
		</button>
		<div class="loading-model" style:visibility={currentlyUpdating[1] ? 'visible' : 'hidden'} style:height="{loadingModelSize}px" style:width="{loadingModelSize}px">
			<img src={IconLinks.loader} alt="Loading Icon"/>
		</div>
	</div>
</div>