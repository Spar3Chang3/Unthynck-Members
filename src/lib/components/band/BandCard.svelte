<script lang="js">
	import { getFileFromStorage, initStorage, initApp } from '$lib/firebase.js';
	import { onMount } from 'svelte';
	import { IconLinks } from '$lib/index.js';

	let showCardBack = $state(false);
	let portrait = $state(IconLinks.loadingIcon);

	let {
		aboutMe,
		hp,
		id,
		imagePath,
		instagramLink = "#",
		facebookLink = "#",
		name,
		position,
		usingUploadedImage = false
	} = $props();

	const toggleCardFlip = (e) => {
		e.preventDefault();
		showCardBack = !showCardBack;
	}

	async function fetchImages() {
		let preload = new Image();

		if (usingUploadedImage) {
			console.log(imagePath);
			preload.src = imagePath;
		} else {
			await getFileFromStorage(imagePath, "portrait.jpg").then((downloadPath) => {
				preload.src = downloadPath;
			});
		}

		preload.onload = () => {
			portrait = preload.src;
		}
	}

	onMount(() => {
		initApp();
		initStorage();
		fetchImages();
	});

</script>

<div class="flip-box">
	<button class="flip-button" style:height={showCardBack ? '80%' : '100%'} onclick={toggleCardFlip} aria-label="flip-button"></button>
	<div class="flip-box-inner" class:show-back={showCardBack}>

		<div class="flip-box-front card" >
			<div class="portrait-container" style:opacity="{showCardBack ? '0' : '1'}" style:transition="opacity 500ms ease">
				<img class="portrait" src={portrait} alt="Band Member portrait" />
			</div>
			<div class="interact-tip-container">
				<img class="interact-tip" src={IconLinks.interaction} alt="Interaction Hint Icon - click card to flip" />
			</div>
		</div>

		<div class="flip-box-back card">
			<div class="content">
				<div class="banner">
					<h1>{name}</h1>
				</div>
				<div class="type-caption">
					<h3>{position}</h3>
				</div>
				<div class="stats">
					<div class="health"><h3>HP: {hp}</h3></div>
					<div class="about-me">
						<p>{aboutMe}</p>
					</div>

					<div class="socials">
						<a href={instagramLink} target="_blank" style:display={instagramLink.length <= 2 ? 'none' : ''}>
							<img src={IconLinks.instagram} alt={"Instagram"}/>
						</a>
						<a href={facebookLink} target="_blank" style:display={facebookLink.length <= 2 ? 'none' : ''}>
							<img src={IconLinks.facebook} alt={"Facebook"}/>
						</a>
					</div>
				</div>
			</div>
		</div>

	</div>
</div>




<style>
    h1 {
        margin: 0 0 5px;
    }
    .flip-box {
				position: relative;
        background-color: transparent;
        width: 320px;
        height: 480px;
        margin: 0 20px 40px;
        perspective: 1000px;
				z-index: 5;
    }

    .flip-box-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.8s;
        transform-style: preserve-3d;
    }

		.flip-button {
				position: absolute;
				width: 100%;
				border: none;
				background-color: transparent;
				cursor: pointer;
				z-index: 8;
		}

    .show-back {
        transform: rotateY(180deg);
    }

    .flip-box-front, .flip-box-back {
        position: absolute;
        width: 100%;
        height: 100%;
        -webkit-backface-visibility: hidden; /* Safari */
        backface-visibility: hidden;
    }

    .flip-box-front {
        background-color: #000;
    }

    .flip-box-back {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        background-image: url("/backgrounds/card-background.jpg");
				background-position: center;
				background-repeat: no-repeat;
				background-size: cover;
        color: white;
        transform: rotateY(180deg) translateX(6px);
    }

    .card {
				height: inherit;
				width: inherit;
				overflow: hidden;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        border: 1px solid #f1f1f1;
    }

		.content {
				position: relative;
				display: flex;
				flex-direction: column;
				height: 100%;
				width: 100%;
        font-family: var(--font-standard);

				overflow: scroll;
				scrollbar-width: none;
				-ms-overflow-style: none;

				::-webkit-scrollbar {
						display: none;
				}
		}

		.portrait-container {
				position: absolute;
				height: 100%;
				width: 100%;
		}

		.interact-tip-container {
				position: absolute;
				display: flex;
				height: 100%;
				width: 100%;
				justify-content: flex-end;
				align-items: flex-start;
		}

		.portrait {
				position: relative;
				height: inherit;
				width: inherit;
				object-fit: cover;
		}

		.interact-tip {
				position: relative;
				height: 20%;
				width: 20%;
		}

    .banner {
        font-family: "Unthynck Branding", sans-serif;
				font-size: 2rem;
    }

		.stats {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
		}

    .health {
        display: inline-block;
        justify-content: center;
        align-content: center;
        width: 90%;
    }

    .about-me {
        display: inline-block;
        justify-content: center;
        align-content: center;
        text-align: left;
        width: 90%;
				line-height: 1.25rem;
    }

    .socials {
        position: absolute;
				display: flex;

        height: fit-content;
        width: 90%;

				justify-content: flex-end;
        align-items: center;
				padding: 0.5rem;

        backdrop-filter: blur(4px);
				border-radius: 6px;
        overflow: hidden;
        background-color: rgba(255, 255, 255, 0.2);
				bottom: 0.5rem;

				z-index: 10;
    }

    .socials a > img {
        height: inherit;
        width: 3rem;
        margin: 0 auto;
        transition: 250ms ease;
    }

    .socials a:hover > img {
        transform: scale(1.1);
    }

</style>