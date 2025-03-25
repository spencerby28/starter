<script lang="ts">
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import type { Models } from 'node-appwrite';
  import type { Challenger } from '$lib/types';


  type SemanticResult = {
    document_id: string;
    similarity: number;
  };

  let { data } = $props<{ data: PageData }>();
  
  $effect(() => {
    console.log('Page data:', data);
  });

  let searchQuery = $state('');
  let semanticResults = $state<SemanticResult[]>([]);
  let semanticLoading = $state(false);
  
  // Only show filtered results when there's a search, otherwise show all


  let filteredChallengers = $derived.by(() => {
    if (!searchQuery) return [];
    return data.challengers.filter((challenger: Challenger) => {
      const fullName = `${challenger.first_name} ${challenger.last_name}`.toLowerCase();
      return fullName.includes(searchQuery.toLowerCase());
    });
  });

  // Semantic search
  async function handleSemanticSearch(query: string) {
    if (!query.trim()) {
      semanticResults = [];
      return;
    }

    semanticLoading = true;
    try {
      const response = await fetch("https://gauntletdemo.tylercodes.app/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      semanticResults = (result.results || []).slice(0, 10);
    } catch (error) {
      console.error("Error:", error);
      semanticResults = [];
    } finally {
      semanticLoading = false;
    }
  }

  // Increase debounce time and only search if query is 2+ chars
  $effect(() => {
    if (searchQuery.length < 2) {
      semanticResults = [];
      return;
    }

    const timeoutId = setTimeout(() => {
      handleSemanticSearch(searchQuery);
    }, 800); // Increased debounce

    return () => clearTimeout(timeoutId);
  });
</script>

<div class="container mx-auto p-4">
  <div class="mb-8">
    <h1 class="text-3xl font-bold text-foreground mb-6">Challengers</h1>
    
    <!-- <input
      type="text"
      placeholder="Search challengers..."
      bind:value={searchQuery}
      class="w-full max-w-md px-4 py-2 rounded-lg border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
    /> -->
  </div>

  <!-- Single grid that shows either all or filtered results -->
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8 pt-8">
    {#each data.challengers as challenger}
      <div 
        class="card bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center"
        onclick={() => goto(`/challengers/${challenger.$id}`)}
      >
        <div
          class="w-24 h-24 rounded-full mb-3 border-2 border-blue-600 flex items-center justify-center bg-blue-100 text-blue-800 text-3xl font-bold"
        >
          {challenger.first_name.charAt(0)}
        </div>
        <h3 class="text-lg font-semibold text-center text-blue-900">
          {challenger.first_name} {challenger.last_name}
        </h3>
      </div>
    {/each}
  </div>

  <!-- Semantic search results -->
  {#if searchQuery.length >= 2}
    <section class="mb-8">
      <h2 class="text-2xl font-bold text-blue-900 mb-4">Semantic Search Results</h2>
      
      {#if semanticLoading}
        <div class="text-center py-8">
          <div class="loader">Loading...</div>
          <p class="mt-4 text-gray-600">Searching with TinyVec semantic search...</p>
        </div>
      {:else if semanticResults.length > 0}
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {#each semanticResults as result, index}
            {@const challenger = data.challengers.find((c: Challenger) => c.$id === result.document_id)}
            {#if challenger}
              <div 
                class="card bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer flex flex-col items-center"
                onclick={() => goto(`/challengers/${challenger.$id}`)}
              >
                <img
                  src={challenger.headshot}
                  alt={`${challenger.first_name} ${challenger.last_name}`}
                  class="w-24 h-24 rounded-full mb-3 border-2 border-blue-600 object-cover"
                />
                <h3 class="text-lg font-semibold text-center text-blue-900">
                  {challenger.first_name} {challenger.last_name}
                </h3>
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    </section>
  {/if}
</div>