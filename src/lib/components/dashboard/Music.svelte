<script lang="js">
	import { onMount } from 'svelte';
	import { initStorage, AddAlbum } from '$lib/firebase.js';
	import ProgressBar from '$lib/components/layout/ProgressBar.svelte';

	let { isUploading = $bindable(false), storage = false } = $props();

	let labelSize = $state(0);
	let uploadingSongs = $state(false);

	let albumArt = $state();
	let albumArtFile = $state();
	let albumArtUploaded = $state(false);

	let albumName = $state("");

	let songFiles = $state([]);
	let songIndex = $state([]);

	let uploadPromises = $state();
	let uploadFailed = $state(false);
	let uploadFinished = $state(false);

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

	function pushSongs(e) {
		e.preventDefault();

		if (songIndex.length <= 1) {
			return;
		}

		AddAlbum(albumName, albumArtFile, songFiles, songIndex).then((res) => {
			uploadPromises = res;
			uploadingSongs = true;
		});
	}

	onMount(() => {
		if (!storage) {
			initStorage();
		}

		const button = document.querySelector('.save-button');
		labelSize = button.offsetWidth;
	})
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
		<ProgressBar uploadPromises={uploadPromises} bind:uploadFailed={uploadFailed} bind:uploadFinished={uploadFinished} />
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

	</div>

</div>