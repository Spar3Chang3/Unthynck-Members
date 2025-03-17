<script lang="js">
	import { onMount } from 'svelte';
	import BandCard from '$lib/components/band/BandCard.svelte';
	import { initDatabase, getDataFromDatabase, initStorage } from '$lib/firebase.js';

	const memberDataPath = 'public/members';

	let memberName = $state("");
	let memberHp = $state(0);
	let memberId = $state("");
	let aboutMe = $state("");
	let imagePath = $state("");
	let position = $state("");
	let instagramLink = $state("");
	let facebookLink = $state("");

	let portrait = $state();
	let usingUploadedImage = $state(false);

	let labelSize = $state(0);
	let dataRetrieved = $state(false);

	let { isUploading = $bindable(false), storage = false, db = false } = $props();

	async function fetchMemberData() {
		await getDataFromDatabase(memberDataPath).then((data) => {
			const memberSet = Object.values(data);
			const randomNum = Math.floor(Math.random() * memberSet.length);
			memberName = memberSet[randomNum].name;
			memberHp = memberSet[randomNum].hp;
			memberId = memberSet[randomNum].id;
			aboutMe = memberSet[randomNum].aboutMe;
			imagePath = memberSet[randomNum].imagePath;
			position = memberSet[randomNum].position;
			instagramLink = memberSet[randomNum].instagramLink;
			facebookLink = memberSet[randomNum].facebookLink;

			dataRetrieved = true;
		}).catch((err) => {
			alert(("Could not obtain members :( Please try refreshing or come back later - " + err));
		})
	}

	function handlePortraitUpload(e) {
		e.preventDefault();

		let file = e.target.files;

		if (file.length > 1) {
			file = file[0];
		}

		if (file.name !== 'portrait.jpg') {
			file = new File([file], 'portrait.jpg', { type: 'image/jpeg', lastModified: file.lastModified });
		}

		const url = URL.createObjectURL(file);

		const currentPortrait = new Image();

		currentPortrait.onload = () => {
			dataRetrieved = false;
			portrait = currentPortrait;
			imagePath = currentPortrait.src;
			dataRetrieved = true;
		}

		currentPortrait.src = url;
		isUploading = true;
		usingUploadedImage = true;
	}

	function pushCardUpdate(e) {
		e.preventDefault();

	}

	onMount(() => {
		if (!storage) {
			initStorage();
		}

		if (!db) {
			initDatabase();
		}

		fetchMemberData();

		const button = document.querySelector('.save-button');
		labelSize = button.offsetWidth;
	});

</script>
<style lang="css">

    hr {
        width: 95%;
        height: 0.1rem;
        background-color: var(--banner-accent);
        border: none;
    }

    h3 {
        font-size: 1.5rem;
    }

    .meet-the-band {
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

    .upload-section {
        position: relative;
        display: flex;
        flex-direction: column;

        height: fit-content;
        width: 95%;

        gap: 1rem;
    }

    .upload-section, .finish-upload {
        margin-bottom: 2rem;
    }


    .file-upload {
        position: relative;
        display: flex;
        flex-direction: column;

        width: 100%;

				justify-content: center;
				align-items: center;
				gap: 1rem;
    }

    .file-upload input[type="file"] {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
    }

    .file-upload input[type="text"], .file-upload input[type="number"] {
        position: relative;
        width: 80%;
        padding: 0.5rem;
        border: 1px solid var(--banner-accent);
        border-radius: 0;
        background-color: var(--background-secondary);
        color: var(--primary-color);
        font-family: var(--font-standard);
        resize: vertical;
        font-size: 1.25rem;
    }

    .upload-button {
        padding: 0.75rem 0 0.75rem 0;
        background-color: var(--secondary-color);
        color: var(--text-standard);
        border-radius: 0;
        border: none;
        cursor: pointer;
        transition: 100ms ease;
        text-align: center;
				margin-bottom: 2rem;
    }

    .upload-button:hover, .save-button:hover {
        background-color: var(--banner-accent);
    }

    .upload-button:active, .save-button:active {
        background-color: var(--banner-accent);
        transform: scale(0.95);
    }

		.input-section {
				position: relative;
				display: grid;
				grid-template-columns: 15% 85%;

				height: fit-content;
				width: 100%;

				align-items: center;
		}

    .text-input-label {
				width: 100%;
        padding: 0.75rem 0.75rem 0.75rem 0;
        font-family: var(--font-standard);
        color: var(--text-standard);
        font-size: 1.25rem;
        text-align: left;
    }

    textarea {
        position: relative;
        width: 100%;
        padding: 0.25rem;
        border: 1px solid var(--banner-accent);
        border-radius: 0;
        background-color: var(--background-secondary);
        color: var(--primary-color);
        font-family: var(--font-standard);
        resize: vertical;
        margin-bottom: 0.5rem;
    }

    textarea:focus {
        outline: none;
        border-color: var(--secondary-color);
        box-shadow: 0 4px 5px rgba(0, 0, 0, 0.08);
    }

    .finish-upload {
        position: relative;
        display: flex;

        height: fit-content;
        width: 95%;
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

		.preview {
				position: relative;
				display: flex;

				height: fit-content;

				justify-content: center;
				align-items: center;
		}

</style>
<div class="meet-the-band">
	<div class="upload-section">
		<h3>Update Band Card</h3>
		<div class="file-upload">
			<div class="input-section">
				<input
					type="file"
					accept="image/*"
					id="portrait"
					onchange={handlePortraitUpload}
				/>
				<label for="portrait" class="upload-button" style="width: {labelSize}px">Choose Portrait (JPG)</label>
			</div>

			<div class="input-section">
				<label for="member-name" class="text-input-label">Name</label>
				<input
					type="text"
					id="member-name"
					bind:value={memberName}
				/>
			</div>

			<div class="input-section">
				<label for="member-hp" class="text-input-label">HP</label>
				<input
					type="number"
					id="member-hp"
					bind:value={memberHp}
				/>
			</div>

			<div class="input-section">
				<label for="member-position" class="text-input-label">Position</label>
				<input
					type="text"
					id="member-position"
					bind:value={position}
				/>
			</div>

			<div class="input-section">
				<label for="member-about-me" class="text-input-label">About Me</label>
							<textarea
								bind:value={aboutMe}
								id="member-about-me"
								placeholder="something about you..."
								rows="3"
							></textarea>
			</div>
		</div>
	</div>

	<div class="finish-upload"
			 style:visibility={isUploading ? 'visible' : 'visible'}
	>
		<button class="save-button"
						onclick={pushCardUpdate}
		>Update Band Card
		</button>
	</div>

	<hr/>

	{#if dataRetrieved}
		<div class="preview">
			<BandCard
				name={memberName}
				hp={memberHp}
				id={memberId}
				aboutMe={aboutMe}
				imagePath={imagePath}
				position={position}
				instagramLink={instagramLink}
				facebookLink={facebookLink}
				usingUploadedImage={usingUploadedImage}
			/>
		</div>
	{/if}
</div>