<script lang="ts">
	import '../../app.css';
	import { onMount } from 'svelte';
    import { PUBLIC_APPWRITE_PROJECT_ID } from '$env/static/public';
	
	
	let { children } = $props();
	let notificationPrefs = {};
	
	onMount(async () => {
		const session = await fetch('/api/web/session').then(res => res.json());
		console.log('session', session);
		if (session.session) {
			const cookieFallback = JSON.stringify({
				[`a_session_${PUBLIC_APPWRITE_PROJECT_ID}`]: session.session
			});
			localStorage.setItem('cookieFallback', cookieFallback);
		}
	});
</script>

{@render children()}
