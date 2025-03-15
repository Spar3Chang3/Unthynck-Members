import { writable, get } from 'svelte/store';

export const authStore = writable({});

export function createAuthStore(userCred, password) {
	authStore.set({
		userCred,
		password: password
	});
}

export function getAuthStore() {
	const store = get(authStore);

	return store;
}