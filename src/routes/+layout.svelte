<script lang="ts">
	import '../app.css';
	import { Sun, Moon } from 'lucide-svelte';
	import { toggleMode, ModeWatcher } from "mode-watcher";
	import { Button } from "$lib/components/ui/button/index.js";
	import CustomDock from "$lib/components/ui/dock/CustomDock.svelte";
	let { children } = $props();

	function handleToggleMode() {
		console.log('Toggle mode button clicked');
		toggleMode();
	}
</script>

<div class="relative min-h-[100svh]">
	<!-- <Button 
		onclick={handleToggleMode} 
		variant="outline" 
		size="icon" 
		class="absolute top-4 right-4 z-50"
	>
		<Sun
			class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
		/>
		<Moon
			class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
		/>
		<span class="sr-only">Toggle theme</span>
	</Button> -->
	
	<div class="absolute top-4 left-1/2 -translate-x-1/2 z-40 sm:block hidden">
		<CustomDock />
	</div>

	<main>
		<ModeWatcher />
		{@render children()}
	</main>

	<div class="sm:hidden fixed bottom-[3rem] left-0 right-0 z-40 flex items-center justify-center">
		<CustomDock />
	</div>
	
	<footer class="sm:hidden fixed bottom-0 w-full bg-background border-t border-border py-2 text-center text-sm text-muted-foreground">
		Gauntlet AI Demo Day
	</footer>
</div>
