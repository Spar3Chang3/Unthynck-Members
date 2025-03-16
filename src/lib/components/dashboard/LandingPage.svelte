<script lang="js">
	import { onMount } from 'svelte';
	import { initStorage } from '$lib/firebase.js';
	import { GetClosestAspectRatio } from '$lib/index.js';

	let { isUploading = $bindable(false), storage = false } = $props();
	let uploadedImages = $state([]);

	let landingText = $state("");

	let labelSize = $state(0);

	const mobile = "mobile";
	const desktop = "desktop";

	const threshold = (5 * 1024 * 1024);

	function handleImageUpload(e) {
			e.preventDefault();
			const files = e.target.files;

			for (const file of files) {
				const url = URL.createObjectURL(file);
				const currentImg = new Image();
				currentImg.onload = () => {
					const width = currentImg.width;
					const height = currentImg.height;

					const ratio = GetClosestAspectRatio(width, height);

					uploadedImages.push({
						name: file.name,
						size: file.size,
						type: file.type,
						url: url,
						platform: ratio.recommendedPlatform,
						aspectRatio: `~ ${ratio.ratio}`,
					});
				}
				currentImg.src = url;
			}

			isUploading = true;
	}

	function handleTextUpdate(e) {
		e.preventDefault();
	}

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

	function pushImages(e) {
		e.preventDefault();
	}

	onMount(() => {
		if (!storage) {
			initStorage();
		}

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
	}

	.uploaded-img {
			position: relative;
			display: grid;
			grid-template-columns: 50% 50%;

			height: fit-content;
			max-width: 100%;

			justify-content: center;
			align-items: center;

			gap: 1rem;
			border: 0.1rem solid var(--banner-accent);
	}

	.uploaded-img img {
			position: relative;
			height: 100%;
			width: 100%;

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

			font-family: sans-serif;
			font-size: 1.2rem;
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

      box-shadow: 0 4px 5px rgba(0, 0, 0, 0.08);
			background-color: var(--primary-color);
			color: whitesmoke;
			transition: 100ms ease;
  }

  .upload-section, .text-section {
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
      margin-bottom: 1rem;
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

		{#if isUploading}
			<div class="finish-upload"
					 style:opacity={isUploading ? 'visible' : 'hidden'}
			>
				<button class="save-button"
								onclick={pushImages}
				>Upload To Website
				</button>
			</div>
		{/if}
	</div>

	<hr/>

	<div class="text-section">
		<h3>Landing Page Text</h3>
		<textarea
			bind:value={landingText}
			placeholder="Enter landing page text..."
			rows="4"
		></textarea>
		<button
			class="save-button"
			onclick={handleTextUpdate}
		>
			Save Text
		</button>
	</div>
</div>