<script lang="js">
	import { onMount } from 'svelte';
	import { getDataFromDatabase } from '$lib/firebase.js';
	import { IconLinks } from '$lib/index.js';

	const contactMessagePath = 'contact';

	let contactMessages = $state([]);

	let fetchedContactData = $state(false);

	async function fetchContactData() {
		await getDataFromDatabase(contactMessagePath).then((data) => {
			contactMessages = Object.values(data);
		}).catch((err) => {
			console.error(err);
		});
	}

	onMount(() => {
		fetchContactData().then(() => {
			fetchedContactData = true;
		});
	})

</script>
<style lang="css">

    h2 {
        font-size: 2rem;
    }

    .contacts {
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

		.view-container {
				position: relative;
				display: flex;
				flex-direction: column;

				height: fit-content;
				width: 95%;

				align-items: center;

				gap: 1rem;
				overflow: hidden;

				margin-bottom: 2rem;
		}

		.contact-message {
				position: relative;
				display: flex;
				flex-direction: column;

				height: fit-content;
				width: 95%;
				padding: 1rem;

				gap: 0.5rem;

				text-wrap: wrap;
				text-align: left;

        border: 0.1rem solid var(--banner-accent);
		}

		.info-center {
        position: relative;
        display: flex;
        flex-direction: row;

        height: fit-content;
        width: 100%;

        align-items: center;
				justify-content: center;
        gap: 1rem;

				font-size: 1.5rem;
		}


		.info-inline {
				position: relative;
				display: flex;
				flex-direction: row;

				height: fit-content;
				width: 100%;

				align-items: center;
				gap: 1rem;

				font-size: 1.25rem;
		}

		pre {
				background-color: #111111;
				padding: 0.25rem;
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
				cursor: text;
    }

    textarea:focus {
        outline: none;
        border-color: var(--secondary-color);
        box-shadow: 0 0 0 2px rgba(122, 42, 191, 0.2);
    }

</style>
<div class="contacts">
	<h2>View Contact Messages</h2>

	{#if fetchedContactData}
		<div class="view-container">
			{#each contactMessages as message}
				<div class="contact-message">
					<div class="info-center"><b>Submitted on</b> <pre>{message.date.day}</pre> at <pre>{new Date(message.date.unix).toLocaleTimeString()}</pre></div>

					<div class="info-inline"><b>Name:</b> <pre>{message.name}</pre></div>

					<div class="info-inline"><b>Email:</b> <a href="mailto:{message.email}">{message.email}</a></div>

					<div class="info-inline"><b>Inquiry:</b> <pre>{message.type}</pre></div>

					<div class="info-inline"><b>Message:</b></div>
					<div class="info-inline">
						<textarea name="message" disabled>{message.businessMessage}</textarea>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<div class="loading-model" id="index-retrieve-info">
			<img src={IconLinks.loader} alt="Loading Icon" />
		</div>
	{/if}
</div>