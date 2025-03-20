<script lang="js">
	import { onMount } from 'svelte';
	import BandCard from '$lib/components/band/BandCard.svelte';
	import ProgressBar from '$lib/components/layout/ProgressBar.svelte';
	import { initDatabase, getDataFromDatabase, initStorage, updateMembers } from '$lib/firebase.js';
	import { IconLinks } from '$lib/index.js';

	const memberDataPath = 'public/members';

	let memberName = $state("");
	let memberHp = $state(0);
	let memberId = $state("");
	let aboutMe = $state("");
	let imagePath = $state("");
	let defaultImagePath = $state("");
	let position = $state("");
	let instagramLink = $state("");
	let facebookLink = $state("");

	let uploadedPortraitName = $state();

	let labelSize = $state(0);
	let dataRetrieved = $state(false);
	let uploadingData = $state(false);
	let usingUploadedImage = $state(false);
	let uploadFinished = $state(false);
	let failedUpload = $state(false);

	let uploadPromises = $state();

	let { isUploading = $bindable(false), storage = false, db = false, uid = "" } = $props();

	async function fetchMemberData() {
		await getDataFromDatabase(memberDataPath).then((data) => {
			const memberSet = Object.values(data);
			const currentMember = memberSet.filter(member => member.uid === uid)[0];
			if (currentMember) {
				defaultImagePath = currentMember.imagePath;

				memberName = currentMember.name;
				memberHp = currentMember.hp;
				memberId = currentMember.id;
				aboutMe = currentMember.aboutMe;
				imagePath = currentMember.imagePath;
				position = currentMember.position;
				instagramLink = currentMember.instagramLink;
				facebookLink = currentMember.facebookLink;
				dataRetrieved = true;
			} else {
				alert("User not found!");
			}
		}).catch((err) => {
			alert(("Could not obtain members :( Please try refreshing or come back later - " + err));
		})
	}

	function handlePortraitUpload(e) {
		e.preventDefault();

		let file = Array.from(e.target.files)[0];

		if (file.length > 1) {
			file = file[0];
		}
		uploadedPortraitName = file.name;

		const url = URL.createObjectURL(file);

		const uploadedPortrait = new Image();

		uploadedPortrait.onload = () => {
			imagePath = uploadedPortrait.src;
			usingUploadedImage = true;
		}

		uploadedPortrait.src = url;
		isUploading = true;
	}

	function pushCardUpdate(e) {
		e.preventDefault();

		const newMemberObj = {
			aboutMe: aboutMe,
			facebookLink: facebookLink,
			hp: memberHp,
			id: memberId,
			imagePath: defaultImagePath,
			instagramLink: instagramLink,
			name: memberName,
			position: position,
			uid: uid
		}

		updateMembers(newMemberObj, usingUploadedImage, imagePath).then((res) => {
			console.log(res);
			if (res[0].success) {
				alert("Upload failed! ", res[0].message);
			} else {
				uploadPromises = res;
				uploadingData = true;
			}
		});

	}

	function cancelImageUpload(e) {
		e.preventDefault();

		usingUploadedImage = false;
	}

	function updateAgain(e) {
		e.preventDefault();

		dataRetrieved = false;
		uploadingData = false;
		usingUploadedImage = false;
		uploadFinished = false;
		failedUpload = false;

		fetchMemberData();
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

		.input-section-with-cancel {
				position: relative;
				display: flex;
				flex-direction: row;

				height: fit-content;
				width: 100%;

				align-items: center;
				gap: 2rem;
		}

		.cancel-section {
				position: relative;
				display: flex;
				flex-direction: row;

				height: 100%;
				width: fit-content;

				justify-content: center;
				align-items: center;

				gap: 1rem;
				margin-bottom: 2rem;
		}

		.cancel-section p {
				margin: 0;
		}

		.cancel-button {
				position: relative;
				display: flex;

				height: fit-content;
				width: fit-content;

				justify-content: center;
				align-items: center;

				padding: 0rem 0.25rem 0.25rem 0.25rem;

				border: none;
				font-size: 3rem;
				line-height: 2.5rem;
				background: none;
				color: var(--text-standard);

				transition: 100ms ease;
		}

		.cancel-button:active {
				transform: scale(0.95);
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

    .loading-model {
        margin-bottom: 1rem;
    }


    .loading-model img {
        height: 10dvh;
        width: 10dvh;
        object-fit: contain;

        animation: rotate 1s infinite linear;
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
<div class="meet-the-band">
	{#if uploadingData}
		<div style="margin-top: 2rem;">
			<ProgressBar uploadPromises={uploadPromises} bind:uploadFinished={uploadFinished} bind:failedUpload={failedUpload} />
		</div>

		<div class="upload-section">
			<div class="input-section-with-cancel">
				<button class="save-button" onclick={updateAgain}>Update Again</button>
			</div>
		</div>
	{:else}
		<div class="upload-section">
			<h3>Update Band Card</h3>
			<div class="file-upload">
				<div class="input-section-with-cancel">
					<input
						type="file"
						accept="image/*"
						id="portrait"
						onchange={handlePortraitUpload}
					/>
					<label for="portrait" class="upload-button" style="width: {labelSize}px">Choose Portrait (JPG)</label>
					<div class="cancel-section" style:visibility={usingUploadedImage ? 'visible' : 'hidden'}>
						<p>{uploadedPortraitName}</p>
						<button class="cancel-button" onclick={cancelImageUpload}>&times;</button>
					</div>
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

		<div class="finish-upload">
			<button class="save-button"
							onclick={pushCardUpdate}
			>Update Band Card
			</button>
		</div>
	{/if}

	<hr/>

	{#if dataRetrieved}
		<div class="preview">
			{#if usingUploadedImage}
				<BandCard
					name={memberName}
					hp={memberHp}
					id={memberId}
					aboutMe={aboutMe}
					imagePath={imagePath}
					position={position}
					instagramLink={instagramLink}
					facebookLink={facebookLink}
					usingUploadedImage={true}
				/>
			{:else}
				<BandCard
					name={memberName}
					hp={memberHp}
					id={memberId}
					aboutMe={aboutMe}
					imagePath={defaultImagePath}
					position={position}
					instagramLink={instagramLink}
					facebookLink={facebookLink}
					usingUploadedImage={false}
				/>
			{/if}
		</div>
	{:else}
		<div class="loading-model">
			<img src={IconLinks.loader} alt="Loading Icon" />
		</div>
	{/if}
</div>