<script lang="ts">
  import { Star, ChevronRight, Send, ChevronsUpDown } from 'lucide-svelte';
  import * as Select from '$lib/components/ui/select';
  import * as Separator from '$lib/components/ui/separator';
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button } from "$lib/components/ui/button/index.js";

  let { team } = $props<{ team: Array<{ id: string; name: string }> }>();

  let rating = $state(0);
  let feedback = $state('');
  let showLearnMore = $state(false);
  let interestedIn = $state<'product' | 'team'>('product');
  let selectedPersonId = $state<string | null>(null);
  let submitted = $state(false);

  function handleSubmit() {
    console.log({ 
      rating, 
      feedback, 
      interestedIn, 
      selectedPerson: team.find((member: { id: string }) => member.id === selectedPersonId)?.name 
    });
    submitted = true;
  }

  $effect(() => {
    // Reset selectedPersonId when switching away from team
    if (interestedIn !== 'team') {
      selectedPersonId = null;
    }
  });
</script>

<div class="space-y-6">
  {#if !submitted}
    <!-- Initial Rating View -->
    {#if !showLearnMore}
      <div class="flex flex-col items-center space-y-6 py-6">
        <div class="flex justify-center">
          <div class="flex gap-3">
            {#each Array(5) as _, i}
              <button
                class="text-3xl {i < rating ? 'text-primary scale-110' : 'text-muted'} 
                       hover:text-primary hover:scale-110 transition-all duration-200"
                onclick={() => rating = i + 1}
              >
                <Star size={60} fill={i < rating ? 'currentColor' : 'none'} />
              </button>
            {/each}
          </div>
        </div>

        {#if rating > 0}
          <div class="flex flex-col items-center gap-4 w-full max-w-md pt-2">
            <!-- Submit button with send icon -->
            <button
              class="w-full inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 
                     text-base font-medium text-primary-foreground hover:bg-primary/90 
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                     focus-visible:ring-offset-2 transition-colors gap-2"
              onclick={handleSubmit}
            >
              Submit Rating
              <Send size={18} class="ml-1" />
            </button>

            <Separator.Root />
            
            <!-- Add a note and learn more section -->
            <div class="text-center space-y-2">
              <p class="text-sm text-muted-foreground">Want to share more thoughts or learn about the project?</p>
              <button
                class="inline-flex items-center justify-center text-sm font-medium 
                       text-primary hover:text-primary/80 transition-colors gap-1"
                onclick={() => showLearnMore = true}
              >
                Add a note & learn more
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        {/if}
      </div>

    <!-- Learn More View -->
    {:else}
      <div class="space-y-6">
        <div class="space-y-2">
          <label for="feedback" class="text-sm font-medium text-foreground">
            Share your thoughts (optional)
          </label>
          <textarea
            id="feedback"
            bind:value={feedback}
            class="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 
                   text-sm ring-offset-background placeholder:text-muted-foreground 
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring 
                   focus-visible:ring-offset-2"
            placeholder="What did you find most interesting about the presentation?"
          />
        </div>

        <!-- Commented out "I would like to learn more about" section
        <div class="space-y-4">
          <h3 class="text-sm font-medium text-foreground">I would like to learn more about:</h3>
          <div class="flex gap-4">
            <button
              class="flex-1 rounded-md px-4 py-3 text-sm font-medium transition-colors
                     {interestedIn === 'product' ? 
                       'bg-primary text-primary-foreground' : 
                       'bg-muted text-muted-foreground hover:bg-muted/80'}"
              onclick={() => interestedIn = 'product'}
            >
              The Product
            </button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild let:builder>
                
                <Button
                  variant={interestedIn === 'team' ? 'default' : 'secondary'}
                  class="flex-1 rounded-md px-4 py-3 text-sm font-medium transition-colors
                         {interestedIn === 'team' ? 
                           'bg-primary text-primary-foreground' : 
                           'bg-muted text-muted-foreground hover:bg-muted/80'}
                         inline-flex items-center justify-center gap-2"
                  builders={[builder]}
                >
                  <span>
                    {selectedPersonId ? 
                      team.find((member: { id: string }) => member.id === selectedPersonId)?.name : 
                      'The Team'}
                  </span>
                  <ChevronsUpDown size={16} class="opacity-50" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content class="w-56">
                <DropdownMenu.Label>Select Team Member</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.RadioGroup value={selectedPersonId ?? undefined}>
                  {#each team as person}
                    <DropdownMenu.RadioItem 
                      value={person.id}
                      onclick={() => {
                        selectedPersonId = person.id;
                        interestedIn = 'team';
                      }}
                    >
                      {person.name}
                    </DropdownMenu.RadioItem>
                  {/each}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
        -->

        <div class="flex gap-4 pt-4">
          <button
            class="flex-1 inline-flex items-center justify-center rounded-md px-4 py-2.5 
                   text-sm font-medium border border-input hover:bg-accent 
                   focus-visible:outline-none focus-visible:ring-2"
            onclick={() => showLearnMore = false}
          >
            Back to Rating
          </button>
          <button
            class="flex-1 inline-flex items-center justify-center rounded-md bg-primary 
                   px-4 py-2.5 text-sm font-medium text-primary-foreground 
                   hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2
                   gap-2"
            onclick={handleSubmit}
          >
            Submit
            <Send size={16} />
          </button>
        </div>
      </div>
    {/if}

  <!-- Success State -->
  {:else}
    <div class="text-center space-y-4 py-8">
      <h3 class="text-xl font-semibold text-foreground">Thank you for your feedback!</h3>
      <p class="text-muted-foreground">
        {#if interestedIn === 'team'}
          We'll connect you with {team.find((member: { id: string }) => member.id === selectedPersonId)?.name} soon.
        {:else}
          We'll reach out to you shortly to follow up.  
        {/if}
      </p>
      <button
        class="text-sm text-primary hover:underline"
        onclick={() => {
          submitted = false;
          showLearnMore = false;
          rating = 0;
          feedback = '';
          selectedPersonId = null;
          interestedIn = 'product';
        }}
      >
        Submit another response
      </button>
    </div>
  {/if}
</div>
