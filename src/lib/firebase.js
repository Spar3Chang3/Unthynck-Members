import { initializeApp } from 'firebase/app';
import {
	getDownloadURL,
	getStorage,
	listAll,
	ref as storeRef,
	uploadBytes
} from 'firebase/storage';
import { get, getDatabase, push, ref as dbRef, update as dbUpdate } from 'firebase/database';

const firebaseConfig = {
	apiKey: 'AIzaSyAXm0O9pK1Pj2JxCjd-Zlwmn1PQTNlxB6I', //IT'S FINE I SWEAR THE CLIENT NEEDS IT

	authDomain: 'unthynck-band.firebaseapp.com',

	databaseURL: 'https://unthynck-band-default-rtdb.firebaseio.com',

	projectId: 'unthynck-band',

	storageBucket: 'unthynck-band.appspot.com',

	messagingSenderId: '909124920050',

	appId: '1:909124920050:web:b74ddb694a57702dfca66b',

	measurementId: 'G-99L1JC49Z1'
};

let firebaseApp;
let firebaseStorage;
let firebaseDatabase;

export function initApp() {
	return (firebaseApp = initializeApp(firebaseConfig));
}

export function initStorage() {
	if (!firebaseApp) {
		initApp();
	}

	firebaseStorage = getStorage(firebaseApp);

	if (firebaseStorage === null) {
		console.log('App appears to not have been initialized! Attempting...');
		initApp();
		return initStorage();
	}

	return firebaseStorage;
}

export function initDatabase() {
	if (!firebaseApp) {
		initApp();
	}

	firebaseDatabase = getDatabase(firebaseApp);

	if (firebaseDatabase === null) {
		console.log('App appears to not have been initialized! Attempting...');
		initApp();
		return initDatabase();
	}

	return firebaseDatabase;
}

// Getter functions to access current instances
export function getFirebaseApp() {
	if (!firebaseApp) initApp();
	return firebaseApp;
}

export function getFirebaseStorage() {
	if (!firebaseStorage) initStorage();
	return firebaseStorage;
}

export function getFirebaseDatabase() {
	if (!firebaseDatabase) initDatabase();
	return firebaseDatabase;
}

export async function getFileFromStorage(path, fileName) {
	const storage = getFirebaseStorage();

	const storageRef = storeRef(storage, path);

	const listRes = await listAll(storageRef).catch((err) => {
		console.error('Could not access the referenced bucket: ', err);
		return null;
	});

	if (listRes === null) {
		return '';
	}

	const fileRef = listRes.items.find((item) => item.name === fileName);

	if (!fileRef) {
		console.error('Could not find the file from storage: ', fileName);
		return '';
	} else {
		return getDownloadURL(fileRef);
	}
}

export async function getDownloadsFromStorage(path) {
	const storage = getFirebaseStorage();

	const storageRef = storeRef(storage, path);

	const listResult = await listAll(storageRef).catch((err) => {
		console.error('Error fetching storage list: ', err);
		return null;
	});

	if (!listResult) {
		return []; //blank to indicate no downloads
	}

	const urlPromises = listResult.items.map((itemRef) => {
		return getDownloadURL(itemRef).catch((err) => {
			console.error('Error fetching download URL for item(s): ', err);
			return null;
		});
	});

	//Resolve all promises and return filter of no nulls
	const urls = await Promise.all(urlPromises);
	return urls.filter((url) => url !== null);
}

export async function getDataFromDatabase(path) {
	const database = getFirebaseDatabase();

	const dataRef = dbRef(database, path);

	try {
		const snapshot = await get(dataRef);

		if (snapshot.exists()) {
			return snapshot.val(); // This returns the actual data
		} else {
			return []; // Return empty array if no data
		}
	} catch (error) {
		console.error('Error fetching data:', error);
		return [];
	}
}

export async function getJsonIndexDownloads(parentPath) {
	const storage = getFirebaseStorage();
	const dirRef = storeRef(storage, parentPath);
	let indexJsonUrls = [];

	await listAll(dirRef)
		.then(async (subDirs) => {
			const promises = subDirs.prefixes.map(async (subDir) => {
				const subDirContents = await listAll(subDir);
				const index = subDirContents.items.find((item) => item.name === 'index.json');

				if (index) {
					return await getDownloadURL(index);
				}
				return null;
			});

			const results = await Promise.all(promises);
			indexJsonUrls = results.filter((url) => url !== null);
		})
		.catch((err) => {
			console.error('Could not find json index: ', err);
		});

	return indexJsonUrls;
}

export async function updateLandingPage(newImages, landingPageText) {
	const storage = getFirebaseStorage();
	const db = getFirebaseDatabase();
	let imageBlobs;
	let uploadPromises;

	try {
		const dbPath = 'public/landingPage';
		const landingTextRef = dbRef(db, dbPath);

		if (newImages.length > 0) {
			imageBlobs = newImages.map((image) => {
				const extension = image.name.split('.').pop().toLowerCase();
				const id = `${Date.now()}-${Math.floor(Math.random() * 1000000)}.${extension}`;
				return { name: image.name, blobUrl: image.blobUrl, platform: image.platform, id: id };
			});

			uploadPromises = imageBlobs.map((blob) => {
				const imageRef = storeRef(storage, `images/slideshow/${blob.platform}/${blob.id}`);
				const uploadPromise = uploadBytes(imageRef, blob.blobUrl);
				return { name: blob.name, promise: uploadPromise };
			});
		}

		const dbPromise = {
			name: 'Landing Page Text',
			promise: dbUpdate(landingTextRef, { text: landingPageText })
		};

		if (newImages.length > 0) {
			return [dbPromise, ...uploadPromises];
		} else {
			return [dbPromise];
		}
	} catch (err) {
		console.error('Could not update landing page: ', err);
		return [{ success: false, statusCode: 500, message: err }];
	}
}

export async function updateMembers(updatedObj, isUsingUploadedImage, newPortraitPath) {
	const db = getFirebaseDatabase();

	try {
		const dbPath = `public/members/${('' + updatedObj.id).padStart(2, '0')}`;
		const userRef = dbRef(db, dbPath);

		const dbPromise = { name: 'Member Data', promise: dbUpdate(userRef, updatedObj) };

		if (isUsingUploadedImage) {
			const portraitUploadPromise = updateMemberPortrait(updatedObj.imagePath, newPortraitPath);
			console.log(portraitUploadPromise);

			return [{ name: 'portrait.jpg', promise: portraitUploadPromise }, dbPromise];
		} else {
			return [dbPromise];
		}
	} catch (err) {
		console.error('Could not update members: ', err);
		return [
			{
				success: false,
				statusCode: 500,
				message: `Failed to update member ${updatedObj.name}: ${err.message}`
			}
		];
	}
}

async function updateMemberPortrait(portraitPath, newPortrait) {
	const storage = getFirebaseStorage();

	try {
		const res = await fetch(newPortrait);
		const portrait = await res.blob();

		const portraitRef = storeRef(storage, `${portraitPath}/portrait.jpg`);
		return uploadBytes(portraitRef, portrait);
	} catch (e) {
		console.error('Could not update member portrait: ', e);
		return [{ success: false, message: e.message }];
	}
}

export async function AddAlbum(albumName, art, songFiles, index) {
	const storage = getFirebaseStorage();
	const indexString = JSON.stringify(index, null, 2);
	const indexBlob = new Blob([indexString], { type: 'application/json' });

	try {
		// Upload art first
		const artRef = storeRef(storage, `releases/${albumName}/art/art.png`);
		const artRes = uploadBytes(artRef, art);
		const artUploadPromise = { name: 'art.png', promise: artRes };

		//Upload songs in parallel
		const songUploadPromises = songFiles.map((songFile) => {
			const songRef = storeRef(storage, `releases/${albumName}/music/${songFile.name}`);
			const uploadPromise = uploadBytes(songRef, songFile);
			return { name: songFile.name, promise: uploadPromise };
		});

		// Upload index
		const indexRef = storeRef(storage, `releases/${albumName}/index.json`);
		const indexRes = uploadBytes(indexRef, indexBlob);
		const indexUploadPromise = { name: 'index.json', promise: indexRes };

		// Return all results
		return [artUploadPromise, ...songUploadPromises, indexUploadPromise];
	} catch (err) {
		console.error('Could not add album: ', err);
		return [{ success: false, statusCode: 500, message: err.message }];
	}
}

export async function updateSongDescriptions(newSongIndexes) {
	const storage = getFirebaseStorage();

	try {
		const indexUploadPromises = newSongIndexes.map((index) => {
			const indexString = JSON.stringify(index, null, 2);
			const indexBlob = new Blob([indexString], { type: 'application/json' });

			const artworkPath = index[0].trackPath.split('/'); //This is super temporary, it's not a great way to determine the album name
			const indexRef = storeRef(storage, `${artworkPath[0]}/${artworkPath[1]}/index.json`);
			const uploadPromise = uploadBytes(indexRef, indexBlob);

			return { name: `${artworkPath[1]} index`, promise: uploadPromise };
		});

		return [...indexUploadPromises];
	} catch (err) {
		console.error('Could not update song descriptions: ', err);
		return [{ success: false, statusCode: 500, message: err.message }];
	}

}