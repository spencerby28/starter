<script lang="ts">
  import { ArrowLeft, Mail, Phone, Github } from 'lucide-svelte';

  let { personId, onBack } = $props<{
    personId: string;
    onBack: () => void;
  }>();

  let person = $derived.by(() => {
    // In real app, fetch person details based on personId
    return {
      id: personId,
      name: "John Doe",
      role: "Project Lead",
      email: "john@example.com",
      phone: "+1 234 567 8900",
      github: "johndoe",
      bio: "Experienced project lead with expertise in AI and machine learning...",
      avatar: null
    };
  });
</script>

<div class="h-full">
  <button
    class="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
    onclick={onBack}
  >
    <ArrowLeft size={16} />
    Back to Team
  </button>

  <div class="flex flex-col gap-6">
    <div class="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-3xl font-medium">
      {person.name[0]}
    </div>
    
    <div class="space-y-4">
      <div>
        <h2 class="text-2xl font-bold text-foreground">{person.name}</h2>
        <p class="text-muted-foreground">{person.role}</p>
      </div>

      <div class="space-y-2">
        <a href={`mailto:${person.email}`} class="flex items-center gap-2 text-primary hover:text-primary/80">
          <Mail size={16} />
          {person.email}
        </a>
        <a href={`tel:${person.phone}`} class="flex items-center gap-2 text-primary hover:text-primary/80">
          <Phone size={16} />
          {person.phone}
        </a>
        <a href={`https://github.com/${person.github}`} class="flex items-center gap-2 text-primary hover:text-primary/80">
          <Github size={16} />
          {person.github}
        </a>
      </div>

      <p class="text-muted-foreground">{person.bio}</p>
    </div>
  </div>
</div>
