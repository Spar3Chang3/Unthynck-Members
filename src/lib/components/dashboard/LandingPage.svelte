<script lang="js">
	import { onMount } from 'svelte';
	import { initStorage, updateLandingPage, getDataFromDatabase } from '$lib/firebase.js';
	import { GetClosestAspectRatio } from '$lib/index.js';
	import ProgressBar from '$lib/components/layout/ProgressBar.svelte';

	let { isUploading = $bindable(false) } = $props();
	let uploadedImages = $state([]);

	let landingText = $state("");
	let initialLandingText = $state("");

	let labelSize = $state(0);

	const mobile = "mobile";
	const desktop = "desktop";

	const threshold = (5 * 1024 * 1024);
	const landingTextPath = 'public/landingPage/text';

	let uploadingData = $state(false);
	let uploadPromises = $state();

	let failedUpload = $state(false);
	let uploadFinished = $state(false);

	async function fetchLandingData() {
		getDataFromDatabase(landingTextPath).then((data) => {
			landingText = data;
			initialLandingText = data;
		});
	}

	function handleImageUpload(e) {
			e.preventDefault();
			const files = e.target.files;

			for (const file of files) {
				const url = URL.createObjectURL(file);
				const currentImg = new Image();
				currentImg.onload = async () => {
					const width = currentImg.width;
					const height = currentImg.height;

					const ratio = GetClosestAspectRatio(width, height);

					let blob = await fetch(url);
					blob = await blob.blob();

					uploadedImages.push({
						name: file.name,
						size: file.size,
						type: file.type,
						url: url,
						blobUrl: blob,
						platform: ratio.recommendedPlatform,
						aspectRatio: `~ ${ratio.ratio}`,
						height: height,
						width: width
					});
				}
				currentImg.src = url;
			}

			isUploading = true;
	}

	// async function handleImageUploads(e) {
	// 	e.preventDefault();
	// 	const files = Array.from(e.target.files);
	//
	// 	//Iterate over each file
	// 	const uploadPromises = files.map(async (file) => {
	// 		const url = URL.createObjectURL(file);
	// 		const currentImg = new Image();
	//
	// 		//Make sure to handle async correctly by waiting for the image load and blob fetch
	// 		await new Promise((resolve) => {
	// 			currentImg.onload = async () => {
	// 				const width = currentImg.width;
	// 				const height = currentImg.height;
	// 				const ratio = GetClosestAspectRatio(width, height);
	//
	// 				//Fetch the image as a blob
	// 				let blob = await fetch(url);
	// 				blob = await blob.blob();
	//
	// 				//Push the object with the image data
	// 				uploadedImages.push({
	// 					name: file.name,
	// 					size: file.size,
	// 					type: file.type,
	// 					url: url,
	// 					blobUrl: blob,
	// 					platform: ratio.recommendedPlatform,
	// 					aspectRatio: `~ ${ratio.ratio}`,
	// 					height: height,
	// 					width: width
	// 				});
	//
	// 				resolve();  //Resolve the promise after the image is fully loaded and processed
	// 			};
	// 		});
	//
	// 		currentImg.src = url;  //Trigger the image load
	// 	});
	//
	// 	// Wait for all image processing promises to resolve
	// 	await Promise.all(uploadPromises);
	// }


	function setPlatform(platform, index) {
		uploadedImages[index] = {
			...uploadedImages[index],
			platform: platform
		}
	}

	function calculateNearestSize(bytes) {
		const units = ['bytes', 'KB', 'MB', 'GB', 'TB'];
		let size = bytes;
		let unitIndex = 0;

		//Loop to convert to the appropriate unit
		while (size >= 1024 && unitIndex < units.length - 1) {
			size /= 1024;
			unitIndex++;
		}

		const qualityMarker = bytes >= threshold ? '❌' : '✅';

		//Return the size rounded to one decimal place with the appropriate unit
		return `${Math.floor(size)} ${units[unitIndex]} ${qualityMarker}`;
	}

	async function pushData(e) {
		e.preventDefault();

		if (landingText !== initialLandingText || uploadedImages.length > 0) {
			updateLandingPage(uploadedImages, landingText).then((res) => {
				console.log(res);
				if (res[0].success) {
					alert("Updating the landing page failed!", res[0].message);
				} else {
					uploadPromises = res;
					uploadingData = true;
				}
			});
		}
	}

	function updateAgain(e) {
		e.preventDefault();

		uploadedImages = [];
		uploadingData = false;
		failedUpload = false;
		uploadFinished = false;

		fetchLandingData();
	}

	onMount(() => {
		const button = document.querySelector('.save-button');
		if (button.offsetWidth !== 0) {
			labelSize = button.offsetWidth;
		}

		fetchLandingData();
	});

</script>
<style lang="css">

		hr {
				width: 95%;
				height: 0.1rem;
				background-color: var(--banner-accent);
				border: none;
		}

    h2 {
        font-size: 2rem;
    }

    h3 {
        font-size: 1.5rem;
    }


    .landing-page {
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

	.file-upload {
			position: relative;
			display: flex;
			flex-direction: column;
			width: 100%;
	}

  .file-upload input[type="file"] {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
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

  .upload-button:hover, .save-button:hover {
      background-color: var(--banner-accent);
  }

	.upload-button:active, .platform-toggle:active, .save-button:active {
			background-color: var(--banner-accent);
			transform: scale(0.95);
	}

	.img-display {
			position: relative;
			display: flex;
			flex-wrap: wrap;

			height: fit-content;
			max-width: 95%;

			gap: 1rem;
	}

	.uploaded-img {
			position: relative;
			display: grid;
			grid-template-columns: 50% 50%;

			height: fit-content;
			min-width: 400px;
			max-width: 100%;

			justify-content: center;
			align-items: center;

			gap: 1rem;
			border: 0.1rem solid var(--banner-accent);
	}

	.uploaded-img img {
			position: relative;
			height: 85%;
			width: 85%;

			object-fit: contain;
			object-position: center;
	}

	.img-utils {
			position: relative;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 50% 50%;

			height: 100%;
			width: 100%;

			justify-content: center;
			align-items: center;
	}

	.img-info {
			position: relative;
			display: flex;
			flex-direction: column;

			height: 100%;
			width: 100%;

			justify-content: center;
			align-items: start;

			font-size: 1.25rem;
			line-height: 1rem;
			font-family: var(--font-standard);
	}

	.button-group {
			position: relative;
			display: grid;
			grid-template-columns: 50% 50%;

			height: fit-content;
			max-width: 95%;

			gap: 0;
	}

	.button-group button {
			height: fit-content;
			width: 100%;

			border: none;
			border-radius: 0;
			padding: 1rem 0 1rem 0;

			text-align: center;
			font-size: 1rem;
			font-family: var(--font-standard);

      box-shadow: 0 4px 5px rgba(0, 0, 0, 0.08);
			background-color: var(--primary-color);
			color: whitesmoke;
			transition: 100ms ease;

			cursor: pointer;
  }

	.upload-section {
			margin-bottom: 1rem;
	}

  .text-section {
      margin-bottom: 2rem;
  }

	.text-section {
			position: relative;
			display: flex;
			flex-direction: column;

			height: fit-content;
			width: 95%;
	}

  textarea {
			position: relative;
      width: 95%;
      padding: 0.75rem;
      border: 1px solid var(--banner-accent);
      border-radius: 0;
      background-color: var(--background-secondary);
      color: var(--primary-color);
      font-family: var(--font-standard);
      resize: vertical;
      margin-bottom: 2rem;
  }

  textarea:focus {
      outline: none;
      border-color: var(--secondary-color);
      box-shadow: 0 0 0 2px rgba(122, 42, 191, 0.2);
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

</style>
<div class="landing-page">
	<h2>Landing Page Content</h2>

	{#if uploadingData}
		<div style="margin-top: 2rem;">
			<ProgressBar uploadPromises={uploadPromises} bind:uploadFinished={uploadFinished} bind:failedUpload={failedUpload} />
		</div>

		<div class="upload-section">
			<div class="input-section-with-cancel">
				<button class="save-button" onclick={updateAgain} disabled={!uploadFinished}>Update Again</button>
			</div>
		</div>
	{:else}
		<div class="upload-section">
			<h3>Update Landing Images</h3>
			<div class="file-upload">
				<input
					type="file"
					accept="image/*"
					id="landing-image"
					multiple
					onchange={handleImageUpload}
				/>
				<label for="landing-image" class="upload-button" style="width: {labelSize}px;}">
					Choose Images
				</label>
			</div>

			<div class="img-display">
				{#each uploadedImages as image, index}
					<div class="uploaded-img">
						<img src={image.url} alt="Uploaded Image ${index + 1}" />
						<div class="img-utils">
							<div class="img-info">
								<p>{image.name}</p>
								<p>{calculateNearestSize(image.size)}</p>
								<p>{`${image.width} × ${image.height}`}</p>
								<p>{image.aspectRatio}</p>
							</div>
							<div class="button-group">
								<button class="platform-toggle"
												style:background-color="{image.platform === desktop ? 'var(--secondary-color)' : 'var(--primary-color)'}"
												onclick={() => setPlatform(desktop, index)}
								>Desktop</button>
								<button class="platform-toggle"
												style:background-color="{image.platform === mobile ? 'var(--secondary-color)' : 'var(--primary-color)'}"
												onclick={() => setPlatform(mobile, index)}
								>Mobile</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<hr/>

		<div class="text-section">
			<h3>Landing Page Text</h3>
			<textarea
				bind:value={landingText}
				placeholder="Enter landing page text..."
				rows="4"
				disabled={landingText.length === 0}
			></textarea>
			<button
				class="save-button"
				onclick={pushData}
			>
				Update Website
			</button>
		</div>
	{/if}

</div>