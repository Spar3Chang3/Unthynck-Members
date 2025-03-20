<script lang="js">
	import { onMount } from 'svelte';

	let { uploadPromises, failedUpload = $bindable(false), uploadFinished = $bindable(false), totalWidth = '90vw' } = $props();

	let currentlyUploadingNames = $state([]);
	let initialUploadLength = $state(0);
	let failedUploads = $state([]);

	let progress = $derived(Math.floor((100 / initialUploadLength) * (initialUploadLength - currentlyUploadingNames.length)));

	function awaitUploads(uploads) {
		uploads.forEach(async (upload) => {
			await upload.promise.then((res) => {
				currentlyUploadingNames.splice(currentlyUploadingNames.indexOf(upload.name), 1);
			}).catch((err) => {
				failedUploads.push(upload.name);
				failedUpload = true;
			});
		})
	}

	onMount(() => {
		uploadPromises.forEach((upload) => {
			currentlyUploadingNames.push(upload.name);
		});
		initialUploadLength = currentlyUploadingNames.length;
		awaitUploads(uploadPromises);
	});

	$effect(() => {
		if (currentlyUploadingNames.length < 1 && failedUploads.length === 0) {
			uploadFinished = true;
		}
	});
</script>
<style lang="css">
	.progress-bar {
			position: relative;
			display: grid;
			grid-template-columns: 100%;
			grid-template-rows: 50% 50%;

			margin-bottom: 1rem;
	}

	.progress {
			position: relative;
			display: flex;
			flex-direction: row;

			height: 2rem;
			width: 100%;

	}

	.bar-container {
			position: relative;
			height: 100%;

			border: 0.1rem solid var(--banner-accent);
	}

	.percentage {
			position: absolute;
			display: flex;

			height: 100%;

			top: 0;
			right: 0.5rem;

			align-items: center;

			font-size: 1.25rem;
	}

	.bar {
			position: absolute;
			height: 100%;

			top: 0;
			left: 0;

			border: none;
			background-color: var(--secondary-color);
			transition: 200ms ease;
			z-index: 4;
	}

	.upload-info {
			position: relative;
			display: flex;
			flex-direction: row;

			height: 100%;
			width: 100%;

			justify-content: center;
			align-items: center;
			color: var(--text-standard);

			font-size: 1.25rem;
	}

</style>
<div class="progress-bar" style="width: {totalWidth};">
	<div class="progress">
		<div class="bar-container" style="width: {totalWidth};}">
			<div class="percentage">
				<p style="z-index: 5"><i>{progress} %</i></p>
			</div>
			<div class="bar" style="width: {progress}%;"></div>
		</div>
	</div>
	<div class="upload-info" id="upload-info">
		{#if failedUpload}
			<p><b style="color: red;">Upload for {failedUploads[0]} has failed!</b></p>
		{:else if uploadFinished}
			<p><b>Upload finished &#129395;</b></p>
		{:else}
			<p><b>Uploading: </b> {currentlyUploadingNames[0]} <small style="font-size: 0.85rem;"> and {currentlyUploadingNames.length - 1} more...</small></p>
		{/if}
	</div>
</div>