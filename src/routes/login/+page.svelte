<script>
    import { onMount } from 'svelte';
    import { browserLocalPersistence, getAuth, setPersistence, signInWithEmailAndPassword } from 'firebase/auth';
    import { initApp } from '$lib/firebase.js';
    import { goto } from '$app/navigation';

    let email = $state('');
    let password = $state('');
    let isLoading = $state(false);

    let isFormValid = $derived(email && password);

    let showAttemptInfo = $state(false);
    let attemptInfo = $state();

    async function handleSubmit() {

        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password)
          .then((userCred) => {
              if (userCred.user.email === email) {

                  setPersistence(auth, browserLocalPersistence);

                  goto('/dashboard');
              }
          })
          .catch((err) => {
              attemptInfo = err.code;
              showAttemptInfo = true;
          });
    }


    onMount(() => {
       initApp();
    });
</script>

<section class="login">
    <div class="login-box">
        <div class="header">
            <h2>Sign in to your account</h2>
        </div>
        <div class="attempt-info" style:visibility={showAttemptInfo ? 'visible' : 'hidden'}>
            <p>Your Username or Password is likely incorrect</p>
            <p>{attemptInfo}</p>
        </div>
        <form onsubmit={handleSubmit}>
            <div class="input-group">
                <div class="input-field">
                    <label for="email-address">Email address</label>
                    <input
                            id="email-address"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            bind:value={email}
                            placeholder="Email address"
                    />
                </div>
                <div class="input-field">
                    <label for="password">Password</label>
                    <input
                            id="password"
                            name="password"
                            type="password"
                            autocomplete="current-password"
                            required
                            bind:value={password}
                            placeholder="Password"
                    />
                </div>
            </div>

            <div class="form-options">
                <div class="forgot-password">
                    <a href="/forgot-password">Forgot your password?</a>
                </div>
            </div>

            <button
                    type="submit"
                    disabled={!isFormValid || isLoading}
                    class="submit-button"
            >
                {#if isLoading}
                    <div class="spinner"></div>
                    Signing in...
                {:else}
                    <svg class="lock-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                    </svg>
                    Sign in
                {/if}
            </button>
        </form>
    </div>
</section>

<style>
    .login {
        height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .login-box {
        position: relative;
        display: flex;
        flex-direction: column;

        align-items: center;

        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        background-color: var(--primary-color);
        padding: 2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .attempt-info {
        text-align: center;
        font-size: 1rem;
        margin-bottom: 2rem;

        font-family: var(--font-standard);
        color: red;
    }

    .header {
        text-align: center;
        font-size: var(--banner-text-size);
    }

    h2 {
        font-size: 3rem;
        font-family: var(--font-special);
        color: var(--text-standard);
        margin: 0;
    }

    form {
        display: flex;
        flex-direction: column;

        gap: 1.5rem;
        font-family: var(--font-standard);
        line-height: var(--line-height-standard);
    }

    .input-group {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 400px;
        gap: 1rem;
    }

    .input-field {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label {
        font-size: 0.875rem;
        color: var(--text-standard);
    }

    input[type="email"],
    input[type="password"] {
        min-width: 200px;
        padding: 0.75rem;
        border: 0.1rem solid var(--banner-accent);
        font-size: 0.875rem;
        background-color: var(--background-secondary);
        color: var(--primary-color);
    }

    input[type="email"]:focus,
    input[type="password"]:focus {
        outline: none;
        border-color: var(--secondary-color);
        box-shadow: 0 0 0 2px rgba(122, 42, 191, 0.2);
    }

    .form-options {
        display: flex;
        justify-content: center;
    }

    .forgot-password a {
        color: var(--link-color);
        text-decoration: none;
        font-size: 0.875rem;
    }

    .forgot-password a:hover {
        text-decoration: underline;
    }

    .submit-button {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        padding: 0.75rem;
        background-color: var(--secondary-color);
        color: var(--text-standard);
        border: none;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        gap: 0.5rem;
        font-family: var(--font-standard);
    }

    .submit-button:hover {
        background-color: var(--banner-accent);
    }

    .submit-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .lock-icon {
        width: 1.25rem;
        height: 1.25rem;
    }

    .spinner {
        width: 1.25rem;
        height: 1.25rem;
        border: 2px solid var(--text-standard);
        border-top-color: transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    @media only screen and (max-width: 768px) {
        .login-box {
            padding: 1.5rem;
        }

        h2 {
            font-size: calc(var(--banner-text-size) * 0.8);
        }
    }
</style>