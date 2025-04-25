<script lang="js">
	import { onMount } from 'svelte';
	import { AddAlbum, getJsonIndexDownloads, updateSongDescriptions } from '$lib/firebase.js';
	import ProgressBar from '$lib/components/layout/ProgressBar.svelte';
	import { IconLinks } from '$lib/index.js';

	let { isUploading = $bindable(false) } = $props();

	let labelSize = $state(40);
	let uploadingSongs = $state(false);
	let uploadingIndexes = $state(false);

	let albumArt = $state();
	let albumArtFile = $state();
	let albumArtUploaded = $state(false);

	let albumName = $state("");

	let songFiles = $state([]);
	let songIndex = $state([]);
	let indexFiles = $state([]);
	let dropdowns = $state([]);

	let songUploadPromises = $state();
	let indexUploadPromises = $state();
	let uploadFailed = $state(false);
	let uploadFinished = $state(false);

	let indexRetrieved = $state(false);


	function handleArtUpload(e) {
		e.preventDefault();

		let file = Array.from(e.target.files)[0];

		if (file.name !== 'art.png') {
			file = new File([file], 'art.png', { type: 'image/png', lastModified: file.lastModified });
		}

		const url = URL.createObjectURL(file);

		const currentArt = new Image();

		currentArt.onload = () => {
			albumArt = currentArt;
			albumArtUploaded = true;
			albumArtFile = file;
		}

		currentArt.src = url;
	}

	async function handleMusicUpload(e) {
		e.preventDefault();
		const files = Array.from(e.target.files);
		isUploading = true;

		try {
			const tracks = await Promise.all(files.map(async (file) => {
				return new Promise((resolve, reject) => {
					const fileName = file.name;
					const firstSpaceIndex = fileName.indexOf(' ');
					const trackNumber = fileName.slice(0, firstSpaceIndex);
					const trackName = fileName.slice(firstSpaceIndex + 1).split('.')[0];
					const url = URL.createObjectURL(file);

					const audio = new Audio(url);

					audio.addEventListener('loadedmetadata', () => {
						resolve({
							trackNumber: trackNumber,
							trackName: trackName,
							trackDuration: Math.round(audio.duration),
							trackPath: `releases/${albumName}/music`,
							fileName: fileName,
							artworkPath: `releases/${albumName}/art`,
							trackDescription: '',
						});
						songFiles.push(file);
						URL.revokeObjectURL(audio.src);
					});

					audio.addEventListener('error', e => {
						reject(new Error(`Error loading audio file ${fileName}`));
					});
				});
			}));

			songIndex = tracks;
		} catch (err) {
			alert(err.message);
		}
	}

	async function getJsons() {
		try {
			const returnArr = await getJsonIndexDownloads('releases');

			const jsonPromises = returnArr.map(async (file) => {
				const response = await fetch(file);
				return response.json();
			});

			indexFiles = Object.values(await Promise.all(jsonPromises));
		} catch (error) {
			console.error('Error fetching JSONs:', error);
			indexFiles = [];
		}
	}

	function updateIndexes(e) {
		e.preventDefault();

		updateSongDescriptions(indexFiles).then((res) => {
			indexUploadPromises = res;
			uploadingIndexes = true;
		});
	}

	function pushSongs(e) {
		e.preventDefault();

		if (songIndex.length <= 1) {
			return;
		}

		AddAlbum(albumName, albumArtFile, songFiles, songIndex).then((res) => {
			songUploadPromises = res;
			uploadingSongs = true;
		});
	}

	function getAlbumName(jsonObj) {
		const split = jsonObj[0].artworkPath.split('/');
		return split[1];
	}

	function toggleDropdown(index) {
		dropdowns[index] = !dropdowns[index];
	}

	onMount(() => {
		const button = document.querySelector('.save-button');
		if (button.offsetWidth !== 0) {
			labelSize = button.offsetWidth;
		}


		getJsons().then(() => {
			if (indexFiles.length <= 1) {
				const err = document.createElement('h3');
				err.textContent = 'Error fetching files, please check your console';
				err.style.color = 'lighcoral';

				const info = document.getElementById('index-retrieve-info');
				info.innerHTML = "";
				info.appendChild(err);
			}

			for (let i = 0;i < indexFiles.length; i++) {
				dropdowns.push(false);
			}
			indexRetrieved = true;
		});
	});

</script>
<style lang="css">

		h2 {
				font-size: 2rem;
		}

		h3 {
				font-size: 1.5rem;
		}

		hr {
				width: 0.1rem;
				height: 90%;
				background-color: var(--banner-accent);
				color: var(--banner-accent);
				margin: 0;
		}

    .music {
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

    .upload-section, .edit-song-info-section {
        position: relative;
        display: flex;
        flex-direction: column;

        height: fit-content;
        width: 95%;

        gap: 1rem;
				overflow: hidden;
    }

    .upload-section, .finish-upload {
        margin-bottom: 2rem;
    }


    .file-upload {
        position: relative;
        display: flex;
        flex-direction: row;

        width: 100%;

				align-items: center;
    }

    .file-upload input[type="file"] {
        position: absolute;
        width: 0;
        height: 0;
        opacity: 0;
    }

		.file-upload input[type="text"] {
				position: relative;
				width: 25%;
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
				margin-left: 2rem;
    }

		.notYet {
				background-color: var(--banner-accent);
				cursor: not-allowed;
				opacity: 0.8;
		}

    .upload-button:hover, .save-button:hover {
        background-color: var(--banner-accent);
    }

    .upload-button:active, .save-button:active {
        background-color: var(--banner-accent);
        transform: scale(0.95);
    }

		.album-input-label {
				padding: 0.75rem 0.75rem 0.75rem 0;
				font-family: var(--font-standard);
				color: var(--text-standard);
				font-size: 1rem;
				text-align: center;
		}

		.song-index-display {
				position: relative;
				display: flex;
				flex-direction: column;

				height: fit-content;
				width: 100%;

				align-items: center;

				gap: 1rem;
		}

		.album-info {
				position: relative;
				display: flex;
				flex-direction: row;

				height: fit-content;
				width: 95%;

				align-items: center;
				gap: 1rem;

				margin-top: 0.5rem;
		}

		.album-info img {
				height: 8rem;
				width: 8rem;

				object-fit: cover;
		}

		.album-info h3 {
				font-family: var(--font-special);
				font-size: 4rem;
				color: var(--link-color);
				margin: 0;
		}

		.uploaded-song {
				position: relative;
				display: grid;
				grid-template-columns: 15% 85%;

				height: fit-content;
				width: 95%;

				justify-content: center;
				align-items: center;
				gap: 0.5rem;

				border: 0.1rem solid var(--banner-accent);
		}

		.uploaded-song h4 {
				font-family: var(--font-standard);
				font-size: 1.5rem;
				color: var(--link-color);
		}

		.uploaded-song pre {
				position: relative;
				height: fit-content;
				width: 95%;

				font-size: 1rem;
		}

		.track-number {
				position: relative;
				display: grid;
				grid-template-columns: 70% 30%;

				height: 100%;
				width: 100%;

				place-items: center;

				text-wrap: wrap;

		}

		.track-number h4 {
				margin-right: -20%;
		}

		.song-info {
				position: relative;
				display: flex;
				flex-direction: column;

				height: fit-content;
				width: 100%;
				gap: 0.5rem;
		}

		.song-info h4 {
				margin-bottom: -0.5rem;
		}

		.song-info pre {
				text-wrap: wrap;
		}

		textarea {
				position: relative;
				width: 95%;
				padding: 0.25rem;
				border: 1px solid var(--banner-accent);
				border-radius: 0;
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

		.dropdown {
				position: relative;

				height: 6dvh;
				width: 100%;

				margin: 0;
				padding: 0;

				transition: all 400ms ease;
				overflow: hidden;
		}

		.dropdown .album-index {
				height: 0;
				visibility: hidden;
		}

		.dropdown svg {
				position: absolute;
				bottom: 12%;
				left: 90%;
				transition: 400ms ease;
				transform: rotate(0);
		}

		.open {
				height: fit-content;
				padding-top: 6dvh;
		}

		.open .album-index {
				height: fit-content;
				visibility: visible;
		}

		.open svg {
				transform: rotate(180deg);
		}

		.open-button {
				position: absolute;

				height: 6dvh;
				width: 100%;

				top: 0;

				border: none;
				background-color: var(--banner-accent);

				color: whitesmoke;
				font-size: 1.5rem;

				cursor: pointer;
		}

		.loading-model {
				width: 100%;
				text-align: center;
		}

		.loading-model img {
				width: 20%;
				justify-self: center;
				animation: rotate 3s infinite linear;
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
<div class="music">
	<h2>Music Management</h2>

	<div class="upload-section">
		<h3>Upload Music</h3>
		<div class="file-upload">
			<label for="album-name" class="album-input-label">Album Name</label>
			<input
				type="text"
				id="album-name"
				bind:value={albumName}
			/>

			<input
				type="file"
				accept="image/png"
				id="art-file"
				onchange={handleArtUpload}
				disabled={albumName.length <= 1}
			/>
			<label for="art-file" class="upload-button" style="width: {labelSize}px;" class:notYet={albumName.length <= 1}>
				Choose Art (PNG)
			</label>

			<input
				type="file"
				accept="audio/mp3"
				id="music-file"
				multiple
				onchange={handleMusicUpload}
				disabled={!albumArtUploaded}
			/>
			<label for="music-file" class="upload-button" style="width: {labelSize}px;" class:notYet={!albumArtUploaded}>
				Choose Music Files (MP3)
			</label>
		</div>
	</div>

	{#if uploadingSongs}
		<ProgressBar uploadPromises={songUploadPromises} bind:uploadFailed={uploadFailed} bind:uploadFinished={uploadFinished} />
	{:else}
		<div class="song-index-display">
			{#if albumArtUploaded}
				<div class="album-info">
					<img src={albumArt.src} alt="Album Art"/>
					<h3>{albumName}</h3>
				</div>
			{/if}
			{#each songIndex as song, index}
				<div class="uploaded-song">
					<div class="track-number">
						<h4>{song.trackNumber}</h4>
						<hr/>
					</div>
					<div class="song-info">
						<h4>{song.trackName}</h4>
						<pre>{JSON.stringify(song, null, 2)}</pre>
						<textarea
							bind:value={songIndex[index].trackDescription}
							placeholder="Enter track description..."
							rows="3"
						></textarea>
					</div>
				</div>
			{/each}
		</div>

		<div class="finish-upload"
				 style:visibility={isUploading ? 'visible' : 'visible'}
		>
			<button class="save-button"
							onclick={pushSongs}
			>Upload To Website
			</button>
		</div>
	{/if}

	<hr style="
				width: 95%;
        height: 0.1rem;
        background-color: var(--banner-accent);
        border: none;"/>

	<div class="edit-song-info-section">
		<h3>Edit Song Descriptions</h3>

		{#if indexRetrieved}
			{#if uploadingIndexes}
				<ProgressBar bind:uploadPromises={indexUploadPromises} bind:uploadFinished={uploadFinished} bind:uploadFailed={uploadFailed} />
			{:else}
				{#each indexFiles as json, key}
					<div class="dropdown" class:open={dropdowns[key]}>
						<button class="open-button" onclick={() => toggleDropdown(key)} aria-label="ghost button" title="{dropdowns[key] ? 'close' : 'open'}">
							{getAlbumName(json)}
							<svg width="64" height="64" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="white" stroke="white" stroke-width="1.5" stroke-linejoin="round">
								<!-- Gently imperfect down arrow triangle -->
								<path d="M5.5 8 L12 17 L18.2 8.8 Z" />
							</svg>
						</button>
						<div class="album-index">
							<pre style="background-color: #111111; padding: 0.25rem; max-height: 10dvh; overflow: scroll;">{JSON.stringify(json, null, 2)}</pre>
							<div class="song-desc-container">
								{#each json as song, songKey}
									<p>Description for {song.trackName}:</p>
									<textarea bind:value={indexFiles[key][songKey].trackDescription} placeholder="Enter track description..."></textarea>
								{/each}
							</div>
						</div>
					</div>
				{/each}
				<div class="finish-upload" style="margin-top: 1rem;">
					<button class="save-button" onclick={updateIndexes}>Update Songs</button>
				</div>
			{/if}
		{:else}
			<div class="loading-model" id="index-retrieve-info">
				<img src={IconLinks.loader} alt="Loading Icon" />
			</div>
		{/if}
	</div>

</div>