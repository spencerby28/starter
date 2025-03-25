<script lang="ts">
  import { Users } from 'lucide-svelte';
  
  let { onSelectPerson } = $props<{
    onSelectPerson: (id: string) => void;
  }>();

  let team = $state([
    { 
      id: "1", 
      name: "John Doe", 
      role: "Project Lead",
      avatar: null 
    },
    // ... add more team members
  ]);
</script>

<div class="space-y-6">
  <h3 class="text-lg font-semibold text-foreground flex items-center gap-2">
    <Users size={20} />
    Current Team
  </h3>
  
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    {#each team as member}
      <button
        class="flex items-center gap-4 p-4 rounded-lg border border-border hover:bg-accent transition-colors text-left"
        onclick={() => onSelectPerson(member.id)}
      >
        <div class="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
          {member.name[0]}
        </div>
        <div>
          <p class="font-medium text-foreground">{member.name}</p>
          <p class="text-sm text-muted-foreground">{member.role}</p>
        </div>
      </button>
    {/each}
  </div>
</div>
