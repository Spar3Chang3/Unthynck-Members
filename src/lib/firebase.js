import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, listAll, ref as storeRef, uploadBytes } from 'firebase/storage';
import { get, getDatabase, ref as dbRef, push, update as dbUpdate } from 'firebase/database';
import { getAuth } from 'firebase/auth';

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

let auth;

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

export async function updateMembers(updatedObj) {
	if (!auth) {
		auth = getAuth();
	}

	const db = getFirebaseDatabase();

	try {

		const dbPath = `public/members/${("" + updatedObj.id).padStart(2, "0")}`;
		const userRef = dbRef(db, dbPath);

		await dbUpdate(userRef, updatedObj);

		return { success: true, statusCode: 200, message: `Member ${updatedObj.name} has been updated`}
	} catch (err) {
		console.error('Could not update members: ', err);
		return { success: false, statusCode: 500, message: `Failed to update member ${updatedObj.name}`, error: err.message };
	}

}

export async function updateMemberPortrait(portraitPath, newPortraitSrc) {
	const storage = getFirebaseStorage();
	const portrait = new Blob([(new Image().src=newPortraitSrc)], { type: 'image/jpg' });

	try {
		const portraitRef = storeRef(storage, portraitPath);
		await uploadBytes(portraitRef, portrait).catch((err) => {
			throw new Error('Failed to upload portrait: ' + err.message);
		});

		return { success: true, message: "Successfully uploaded portrait" }
	} catch (e) {
		return { success: false, message: e.message }
	}
}

export async function AddAlbum(albumName, art, songFiles, index) {
	const storage = getFirebaseStorage();
	const indexString = JSON.stringify(index, null, 2);
	const indexBlob = new Blob([indexString], { type: 'application/json' });

	try {
		// Upload art first
		const artRef = storeRef(storage, `releases/${albumName}/art/art.png`);
		const artRes = await uploadBytes(artRef, art).catch((err) => {
			throw new Error('Failed to upload art: ' + err.message);
		});
		const artMessage = { success: true, message: "Successfully uploaded art.png", promise: artRes };

		//Upload songs in parallel
		const songUploadPromises = songFiles.map((songFile) => {
			const songRef = storeRef(storage, `releases/${albumName}/music/${songFile.name}`);
			return uploadBytes(songRef, songFile)  // Upload each song file
				.then(() => ({ success: true, message: `Successfully uploaded ${songFile.name}` }))
				.catch((error) => ({ success: false, message: `Failed to upload ${songFile.name}: ${error.message}` }));
		});

		const songResults = await Promise.all(songUploadPromises);
		const rejected = songResults.some(result => !result.success);  //Check for any failed uploads
		if (rejected) {
			throw new Error("One or more song uploads failed");
		}

		// Upload index
		const indexRef = storeRef(storage, `releases/${albumName}/index.json`);
		const indexRes = await uploadBytes(indexRef, indexBlob).catch((err) => {
			throw new Error('Failed to upload index.json: No result returned');
		});
		const indexMessage = { success: true, message: "Successfully uploaded index.json", promise: indexRes };

		// Return all results
		return { artMessage, songResults, indexMessage };

	} catch (err) {
		console.error('Could not add album: ', err);
		return { success: false, statusCode: 500, message: err.message };
	}
}


export async function pushToContact(contactObj) {
	const db = getFirebaseDatabase();
	const contactRef = dbRef(db, 'contact');

	try {
		const pushedData = await push(contactRef, contactObj);
		if (pushedData.key !== null && pushedData.key !== undefined) {
			return { success: true, statusCode: 200, message: 'Contact pushed successfully', data: pushedData };
		} else {
			return { success: true, statusCode: undefined, message: 'Contact encountered an unexpected non-error', data: pushedData }
		}
	} catch (err) {
		console.error('Could not push contact ref: ', err);
		return { success: false, statusCode: 500, message: 'Failed to push contact', error: err.message };
	}

}