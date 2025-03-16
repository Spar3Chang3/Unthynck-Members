<link rel="prefetch" href="/backgrounds/standard-background.jpg">
<script lang="js">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { initApp } from '$lib/firebase.js';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';

	onMount(() => {
		initApp();
		const auth = getAuth();

		onAuthStateChanged(auth, (user) => {
			if (user) {
				goto('/dashboard');
			} else {
				goto('/login');
			}
		})
	});

</script>
<style lang="css">

</style>
<section class="index">
	<h1>Authorizing...</h1>
</section>