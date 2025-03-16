export const AspectRatios = [
	{ ratio: '16:9', value: 16 / 9, recommendedPlatform: 'desktop' },
	{ ratio: '9:16', value: 9 / 16, recommendedPlatform: 'mobile' }, // Inverse of 16:9 for mobile
	{ ratio: '4:3', value: 4 / 3, recommendedPlatform: 'desktop' },
	{ ratio: '3:4', value: 3 / 4, recommendedPlatform: 'mobile' }, // Inverse of 4:3 for mobile
	{ ratio: '1:1', value: 1, recommendedPlatform: 'desktop' },
	{ ratio: '2:3', value: 2 / 3, recommendedPlatform: 'mobile'  }, // Inverse of 3:2 for mobile
	{ ratio: '3:2', value: 3 / 2, recommendedPlatform: 'desktop'  },
	{ ratio: '21:9', value: 21 / 9, recommendedPlatform: 'desktop'  },
	{ ratio: '9:21', value: 9 / 21, recommendedPlatform: 'mobile'  }, // Inverse of 21:9 for mobile
	{ ratio: '5:4', value: 5 / 4, recommendedPlatform: 'desktop'  },
	{ ratio: '4:5', value: 4 / 5, recommendedPlatform: 'mobile'  }, // Inverse of 5:4 for mobile
]

export function GetClosestAspectRatio(width, height) {
	const imageAspectRatio = width / height;

	// Find the closest aspect ratio by comparing the difference
	let closestRatio = AspectRatios[0];
	let minDifference = Math.abs(imageAspectRatio - closestRatio.value);

	for (let i = 1; i < AspectRatios.length; i++) {
		const ratio = AspectRatios[i];
		const difference = Math.abs(imageAspectRatio - ratio.value);

		if (difference < minDifference) {
			minDifference = difference;
			closestRatio = ratio;
		}
	}

	return closestRatio;
}

export const IconLinks = {
	facebook: '/icons/facebook.svg',
	instagram: '/icons/instagram.svg',
	youtube: '/icons/youtube.svg',
	spotify: '/icons/spotify.svg',

	interaction: '/icons/hand-click.svg',
	loadingIcon: '/icons/spinning-note.gif',
	loader: '/icons/loader.svg',

	volumeNone: '/icons/volume-none.svg',
	volumeLow: '/icons/volume-low.svg',
	volumeHigh: '/icons/volume-high.svg',
	volumeMute: '/icons/volume-off.svg',
	playerPlay: '/icons/player-play.svg',
	playerPause: '/icons/player-pause.svg',
	playerShuffleOn: '/icons/player-shuffle-on.svg',
	playerShuffleOff: '/icons/player-shuffle-off.svg',
	playlistAdd: '/icons/playlist-add.svg',
	playlistRemove: '/icons/playlist-remove.svg',
}