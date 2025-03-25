<script lang="ts">
  
  import { goto } from '$app/navigation';
  import type { PageData } from './$types';
  import { page } from '$app/stores';
  import type { Challenger, Capstones } from '$lib/types';
  import { enhance } from '$app/forms';
  import * as AlertDialog from '$lib/components/ui/alert-dialog';
  import Input from '$lib/components/ui/Input.svelte';
  import {Label} from '$lib/components/ui/label';
  

  export let data: PageData;

 
  let isEditing = false;
  let editedChallenger: Challenger;
  let selectedCapstone: string = '';
  let newCapstone = {
    name: '',
    description: '',
    type: ''
  };
  let showCapstoneDialog = false;
  let formError: string | undefined;

  $: challenger = data.challengers?.find((c) => c.$id === $page.params.id) as Challenger | undefined;
  $: capstone = data.capstones?.find((c) => c.$id === challenger?.capstone_id) as Capstones | undefined;
  $: console.log(challenger);
//   $: console.log(challenger);
  $: if (challenger !== undefined) {
    if (!editedChallenger) {
      editedChallenger = { ...challenger } as Challenger;
      selectedCapstone = challenger.capstone_id || '';
    }
  }

  function handleSubmit() {
    // Form submission is now handled by the server action
    // The enhance function will handle the form submission
    return async ({ update }: { update: () => Promise<void> }) => {
      await update();
      isEditing = false;
    };
  }

  function handleCapstoneSubmit() {
    return async ({ result }: { result: any, update: () => Promise<void> }) => {
      if (result.type === 'success') {
        showCapstoneDialog = false; // Close the dialog
        isEditing = false; // Exit edit mode
        // Reset form data
        newCapstone = {
          name: '',
          description: '',
          type: ''
        };
      } else {
        formError = result.message;
      }
    };
  }

  $: projects = challenger ? [
    {
        title: challenger.project1_title,
        description: challenger.project1_description,
        links: [challenger.project1_link1, challenger.project1_link2].filter(Boolean),
      },
      {
        title: challenger.project2_title,
        description: challenger.project2_description,
        links: [challenger.project2_link1, challenger.project2_link2].filter(Boolean),
      },
      {
        title: challenger.project3_title,
        description: challenger.project3_description,
        links: [challenger.project3_link1, challenger.project3_link2].filter(Boolean),
      },
      {
        title: challenger.project4_title,
        description: challenger.project4_description,
        links: [challenger.project4_link1, challenger.project4_link2].filter(Boolean),
      },
    ].filter(p => p.title)
  : [];

</script>
<div class="min-h-screen bg-gradient-to-br from-white to-blue-50">
  <div class="container mx-auto px-4 py-8">

    {#if !challenger}
      <div class="flex flex-col items-center justify-center min-h-[70vh]">
        <h2 class="text-2xl font-bold text-blue-900 mb-4">Challenger not found</h2>
        <button 
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onclick={() => goto('/challengers')}
        >
          Back to Challengers
        </button>
      </div>
    {:else}
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onclick={() => isEditing = !isEditing}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {#if isEditing}
        <form method="POST" action="?/updateChallenger" use:enhance={handleSubmit} class="space-y-6">
          <!-- Basic Info Section -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <h2 class="text-2xl font-bold text-blue-900 mb-4">Basic Information</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label class="block text-sm font-medium text-gray-700">First Name</Label>
                <Input
                  type="text"
                  name="first_name"
                  value={editedChallenger.first_name}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label class="block text-sm font-medium text-gray-700">Last Name</Label>
                <Input
                  type="text"
                  name="last_name"
                  value={editedChallenger.last_name}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label class="block text-sm font-medium text-gray-700">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={editedChallenger.email}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <Label class="block text-sm font-medium text-gray-700">LinkedIn URL</Label>
                <Input
                  type="url"
                  name="linkedin_link"
                  value={editedChallenger.linkedin_link}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Capstone Section -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <h2 class="text-2xl font-bold text-blue-900 mb-4">Capstone Project</h2>
            <div class="space-y-4">
              <!-- Existing Capstone Selection -->
              <div>
                <Label class="block text-sm font-medium text-gray-700">Select Existing Capstone</Label>
                <select
                  name="selectedCapstone"
                  bind:value={selectedCapstone}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select a capstone</option>
                  {#each data.capstones as capstone}
                    <option value={capstone.$id}>{capstone.name}</option>
                  {/each}
                </select>
              </div>
              
              <div class="flex justify-between">
                <button
                  type="button"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onclick={() => showCapstoneDialog = true}
                >
                  Create New Capstone
                </button>
                {#if selectedCapstone}
                  <button
                    type="submit"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Assign Selected Capstone
                  </button>
                {/if}
              </div>
            </div>
          </div>

          <!-- Projects Section -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-blue-100">
            <h2 class="text-2xl font-bold text-blue-900 mb-4">Projects</h2>
            {#each Array(4) as _, i}
              <div class="mb-6 pb-6 border-b border-gray-200 last:border-0">
                <h3 class="text-xl font-bold text-blue-900 mb-3">Project {i + 1}</h3>
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <Label class="block text-sm font-medium text-gray-700">Title</Label>
                    <Input
                      type="text"
                      name={`project${i + 1}_title`}
                      value={editedChallenger[`project${i + 1}_title`]}
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label class="block text-sm font-medium text-gray-700">Description</Label>
                    <textarea
                      name={`project${i + 1}_description`}
                      value={editedChallenger[`project${i + 1}_description`]}
                      rows="3"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    ></textarea>
                  </div>
                  <div>
                    <Label class="block text-sm font-medium text-gray-700">Demo Link 1</Label>
                    <Input
                      type="url"
                      name={`project${i + 1}_link1`}
                      value={editedChallenger[`project${i + 1}_link1`]}
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <Label class="block text-sm font-medium text-gray-700">Demo Link 2</Label>
                    <Input
                      type="url"
                      name={`project${i + 1}_link2`}
                      value={editedChallenger[`project${i + 1}_link2`]}
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            {/each}
          </div>

          <Input type="hidden" name="challengerId" value={challenger.$id} />

          <div class="flex justify-end gap-4">
            <button
              type="button"
              class="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              onclick={() => isEditing = false}
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      {:else}
        <!-- Header Section -->
        <div class="flex flex-col lg:flex-row gap-6 mb-10">
          <!-- Profile Card -->
          <div class="w-full lg:w-1/3">
            <div class="bg-white rounded-xl shadow-md p-6 border border-blue-100">
              <div class="flex flex-col items-center">
                <img 
                  src={challenger.headshot} 
                  alt={`${challenger.first_name} ${challenger.last_name}`}
                  class="w-40 h-40 rounded-full object-cover border-4 border-blue-600 mb-4"
                />
                <h1 class="text-2xl font-bold text-blue-900 text-center">
                  {challenger.first_name} {challenger.last_name}
                </h1>
                <p class="text-gray-600 break-words text-center">{challenger.email}</p>
                
                <div class="flex flex-col w-full gap-2 mt-6">
                  {#if challenger.linkedin_link}
                    <a 
                      href={challenger.linkedin_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                      </svg>
                      LinkedIn
                    </a>
                  {/if}
                  {#if challenger.resume_link}
                    <a 
                      href={challenger.resume_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      class="flex items-center justify-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 1.5L18.5 9H13V3.5zM14 15v2H8v-2h6zm4-3v2H8v-2h10z"></path>
                      </svg>
                      Resume
                    </a>
                  {/if}
                </div>
              </div>
            </div>
          </div>
          
          <!-- About & Capstone -->
          <div class="w-full lg:w-2/3">
            <div class="bg-white rounded-xl shadow-md p-6 border border-blue-100 h-full">
              <h2 class="text-2xl font-bold text-blue-900 mb-4">About</h2>
              <p class="text-gray-700 mb-6">{challenger.bio}</p>
              
              <div class="border-t border-blue-100 my-6"></div>
              
              <!-- Add Capstone section here -->
              <h2 class="text-2xl font-bold text-blue-900 mb-4">
                  Capstone Project: {capstone?.name || 'Not Assigned'}
              </h2>
              {#if capstone}
                  <p class="text-gray-600 mb-3">Type: {capstone.type}</p>
                  <p class="text-gray-700">{capstone.description}</p>
              {:else}
                  <p class="text-gray-600">No capstone project has been assigned yet.</p>
              {/if}
            </div>
          </div>
        </div>

        <!-- Projects Section -->
        <h2 class="text-2xl font-bold text-blue-900 mb-6 mt-10">Projects</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {#each projects as project}
            <div class="bg-white rounded-xl shadow-md p-6 border border-blue-100 h-full">
              <h3 class="text-xl font-bold text-blue-900 mb-3">{project.title}</h3>
              <p class="text-gray-700 mb-4">{project.description}</p>
              
              {#if project.links.some(link => link)}
                <div class="flex flex-wrap gap-2 mt-auto">
                  {#each project.links as link, i}
                    {#if link}
                      <a 
                        href={link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Demo {i + 1}
                      </a>
                    {/if}
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
        
        <!-- Back Button -->
        <div class="mt-10 mb-6">
          <button 
            class="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            onclick={() => goto('/challengers')}
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Challengers
          </button>
        </div>
      {/if}
    {/if}
  </div>
</div>

<!-- Alert Dialog for Capstone Creation -->
<AlertDialog.Root bind:open={showCapstoneDialog}>
    <AlertDialog.Content class="dark:bg-gray-800">
        <AlertDialog.Header>
            <AlertDialog.Title class="dark:text-white">Create New Capstone</AlertDialog.Title>
            <AlertDialog.Description class="dark:text-gray-300">
                Fill out the details below to create a new capstone project.
            </AlertDialog.Description>
        </AlertDialog.Header>

        <form 
            method="POST" 
            action="?/createCapstone" 
            use:enhance={handleCapstoneSubmit} 
            class="space-y-4 py-4"
        >
            <Input
                type="text"
                name="capstone_name"
                Label="Capstone Name"
                required
                error={formError}
                bind:value={newCapstone.name}
            />

            <div class="space-y-2">
                <Label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</Label>
                <select
                    name="capstone_type"
                    required
                    bind:value={newCapstone.type}
                    class="w-full px-3 py-2 rounded-lg shadow-sm 
                           border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700
                           text-gray-900 dark:text-gray-100
                           focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                           dark:focus:ring-blue-400 dark:focus:border-blue-400"
                >
                    <option value="">Select type</option>
                    {#each data.capstoneTypes as type}
                        <option value={type}>{type}</option>
                    {/each}
                </select>
            </div>

            <div class="space-y-2">
                <Label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
                <textarea
                    name="capstone_description"
                    required
                    bind:value={newCapstone.description}
                    rows="3"
                    class="w-full px-3 py-2 rounded-lg shadow-sm 
                           border border-gray-300 dark:border-gray-600
                           bg-white dark:bg-gray-700
                           text-gray-900 dark:text-gray-100
                           focus:ring-1 focus:ring-blue-500 focus:border-blue-500
                           dark:focus:ring-blue-400 dark:focus:border-blue-400"
                ></textarea>
            </div>

            <Input type="hidden" name="challengerId" value={challenger?.$id} />

            {#if formError}
                <p class="text-sm text-red-600 dark:text-red-400">{formError}</p>
            {/if}

            <AlertDialog.Footer class="dark:bg-gray-800">
                <AlertDialog.Cancel class="dark:text-gray-300 dark:hover:bg-gray-700">
                    Cancel
                </AlertDialog.Cancel>
                <AlertDialog.Action>
                    <button
                        type="submit"
                        class="inline-flex items-center justify-center rounded-md text-sm font-medium
                               transition-colors focus-visible:outline-none focus-visible:ring-2 
                               focus-visible:ring-ring focus-visible:ring-offset-2 
                               disabled:pointer-events-none disabled:opacity-50
                               bg-blue-600 dark:bg-blue-500 
                               text-white
                               hover:bg-blue-700 dark:hover:bg-blue-600
                               h-10 px-4 py-2"
                    >
                        Create & Assign
                    </button>
                </AlertDialog.Action>
            </AlertDialog.Footer>
        </form>
    </AlertDialog.Content>
</AlertDialog.Root>
