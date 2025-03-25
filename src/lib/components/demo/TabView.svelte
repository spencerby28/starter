<script lang="ts">
  import { Info } from 'lucide-svelte';
  import RatingsView from './RatingsView.svelte';
  import ScheduleView from './ScheduleView.svelte';
  import * as Tooltip from '$lib/components/ui/tooltip';

  let { team } = $props<{ team: Array<{ id: string; name: string }> }>();
  let tooltipOpen = $state(false);
  
  function toggleTooltip() {
    tooltipOpen = !tooltipOpen;
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Schedule Section -->
  <div class="rounded-xl border border-border bg-card p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">Schedule</h2>
    </div>
    <ScheduleView />
  </div>

  <!-- Ratings Section -->
  <div class="rounded-xl border border-border bg-card p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-semibold">Rate & Feedback</h2>
      <Tooltip.Root open={tooltipOpen}>
        <Tooltip.Trigger onclick={toggleTooltip}>
          <Info size={20} class="text-muted-foreground" />
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p class="max-w-xs">
            Rate the presentation and provide feedback. If you're interested in learning more,
            you can request to connect with the team.
          </p>
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
    <RatingsView {team} />
  </div>
</div>
