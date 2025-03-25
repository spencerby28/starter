<script>
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import CustomDock from "$lib/components/ui/dock/CustomDock.svelte";
    
    onMount(() => {
        goto('/demo');
    });
</script>

