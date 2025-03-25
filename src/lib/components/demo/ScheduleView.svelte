<script lang="ts">
  import { Clock } from 'lucide-svelte';

  let schedule = $state([
    {
      time: "9:00 AM",
      projectName: "AI-Powered Project Management",
      team: ["John Doe", "Jane Smith", "Mike Johnson"]
    },
    {
      time: "9:30 AM",
      projectName: "Smart Home Automation",
      team: ["Alice Brown", "Bob Wilson"]
    },
    {
      time: "10:00 AM",
      projectName: "Healthcare Analytics Platform",
      team: ["Carol Davis", "David Clark"]
    }
  ]);
</script>

<div class="space-y-4">
  {#each schedule as item}
    <div class="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 py-4 border-b border-border last:border-0">
      <div class="flex items-center gap-2 min-w-[100px] text-foreground font-medium">
        <Clock size={16} />
        {item.time}
      </div>
      <div>
        <p class="font-semibold text-foreground">{item.projectName}</p>
        <p class="text-muted-foreground text-sm mt-1">{item.team.join(', ')}</p>
      </div>
    </div>
  {/each}
</div>
