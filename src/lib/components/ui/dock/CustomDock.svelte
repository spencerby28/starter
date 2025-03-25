<script lang="ts">
    // Lucide Svelte
    import {
      UserRound,
      Newspaper,
      TvMinimalPlay,
      Star
    } from "lucide-svelte";
    // Simple Icons : simpleicons.org
    import TwitterSvg from "$lib/svg/x.svg";
    import GithubSvg from "$lib/svg/github.svg";
    import LinkedInSvg from "$lib/svg/linkedin.svg";
    import MailSvg from "$lib/svg/gmail.svg";
    //    Shadcn Components
    import * as Tooltip from "$lib/components/ui/tooltip";
    import Separator from "$lib/components/ui/separator/separator.svelte";
    //   Major Components
    import Dock from "./Dock.svelte";
    import DockIcon from "./DockIcon.svelte";
    import { mode } from "mode-watcher";
    import { dockState } from "$lib/stores/dockState";
  
    // Props for base navigation links
    let { 
      demoLink = "/demo",
      challengersLink = "/challengers", 
      projectsLink = "/projects",
      quickRateLink = "/quick-rate"
    } = $props();

    let isAnimatingOut = $state(false);
    
    let navs = $derived.by(() => {
      const navbar = [
        { label: "Demo", icon: TvMinimalPlay, href: demoLink },
        { label: "Challengers", icon: UserRound, href: challengersLink },
        { label: "Projects", icon: Newspaper, href: projectsLink },
        { label: "Quick Rate", icon: Star, href: quickRateLink },
      ];
      
      const contact = [];
      
      // Only add social links that are provided in the store
      if ($dockState.x) {
        contact.push({ 
          label: "X", 
          icon: TwitterSvg, 
          href: $dockState.x,
          class: $mode === 'dark' ? 'invert' : ''
        });
      }
      
      if ($dockState.linkedin) {
        contact.push({ 
          label: "LinkedIn", 
          icon: LinkedInSvg, 
          href: $dockState.linkedin 
        });
      }
      
      if ($dockState.github) {
        contact.push({ 
          label: "Github", 
          icon: GithubSvg, 
          href: $dockState.github,
          class: $mode === 'dark' ? 'invert' : ''
        });
      }
      
      if ($dockState.email) {
        contact.push({ 
          label: "Email", 
          icon: MailSvg, 
          href: $dockState.email 
        });
      }

      return {
        navbar,
        contact: isAnimatingOut ? contact : contact
      };
    });
</script>
  <!-- h-[52px] overflow-hiddenrounded-lg border bg-gradient-to-b from-transparent via-background to-transparent md:shadow-xl" -->
<div
  class="relative flex w-full max-w-md flex-col items-center justify-center"
>
   
  <!-- <span
    class="pointer-events-none whitespace-pre-wrap bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-4xl md:text-8xl font-semibold leading-none text-transparent dark:from-white dark:to-slate-900/10"
  >
    Svelte Dock
  </span> -->
  <div>
    <Dock
      direction="middle"
      class="relative"
      let:mouseX
      let:distance
      let:magnification
    >
      {#each navs.navbar as item}
        <DockIcon {mouseX} {magnification} {distance}>
          <Tooltip.Root>
            <Tooltip.Trigger
              class="hover:bg-zinc-900/80 transition-all duration-200 rounded-full p-3 mx-0"
            >
              <a href={item.href}>
                <svelte:component this={item.icon} size={22} strokeWidth={1.2} />
              </a>
            </Tooltip.Trigger>
            <Tooltip.Content sideOffset={8}>
              <p>{item.label}</p>
            </Tooltip.Content>
          </Tooltip.Root>
        </DockIcon>
      {/each}

      {#if $dockState.expanded && navs.contact.length > 0}
        <Separator 
          orientation="vertical" 
          class="h-full w-[0.6px] transition-all duration-300 {isAnimatingOut ? 'animate-fade-out' : ''}" 
        />

        {#each navs.contact as item, i}
          <DockIcon {mouseX} {magnification} {distance}>
            <Tooltip.Root>
              <Tooltip.Trigger
                class="hover:bg-zinc-900/80 transition-all duration-200 rounded-full"
              >
                <a href={item.href}>
                  <img 
                    src={item.icon} 
                    alt={item.label} 
                    class="m-3 h-5 w-5 {item.class || ''} animate-in"
                    style="--index: {i}; animation-delay: {i * 200}ms;"
                  />
                </a>
              </Tooltip.Trigger>
              <Tooltip.Content sideOffset={9}>
                <p>{item.label}</p>
              </Tooltip.Content>
            </Tooltip.Root>
          </DockIcon>
        {/each}
      {/if}
    </Dock>
  </div>

  <!-- Optional reset button
  {#if visibleSocials > 0}
    <button 
      onclick={resetSocials}
      class="mt-4 px-4 py-2 text-sm rounded-md bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
    >
      Reset
    </button>
  {/if} -->
</div>

<style>
  .animate-in {
    animation: slideIn 0.5s ease-out forwards;
    opacity: 0;
  }

  .animate-out {
    animation: slideOut 0.5s ease-in forwards;
  }

  .animate-fade-out {
    animation: fadeOut 0.3s ease-in forwards;
  }

  @keyframes slideIn {
    from {
      transform: translateX(20px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(20px);
      opacity: 0;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
</style>
  