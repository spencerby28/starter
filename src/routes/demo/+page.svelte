<script lang="ts">
	import { Video, Users, Clock, Calendar, ChevronRight } from 'lucide-svelte';
	import TabView from '$lib/components/demo/TabView.svelte';
	import PeopleDetailedView from '$lib/components/demo/PeopleDetailedView.svelte';
	import { dockState, updateDockState, toggleDockExpanded } from '$lib/stores/dockState';
    import Separator from '$lib/components/ui/separator/separator.svelte';
	

	

	// Mock data - this would come from your backend later
	const currentDemo = {
		projectName: 'AI-Powered Project Management',
		description:
			'A revolutionary project management tool that leverages artificial intelligence to streamline team collaboration and enhance productivity.',
		team: [
			{ id: '1', name: 'John Doe', avatar: null, github: 'johndoe', x: 'johndoe', email: 'john@example.com', linkedin: 'johndoe' },
			{ id: '2', name: 'Jane Smith', avatar: null, github: 'janesmith', x: 'janesmith' },
			{ id: '3', name: 'Mike Johnson', avatar: null,  x: 'mikejohnson', email: 'mike@example.com', linkedin: 'mikejohnson' },
            { id: '4', name: 'Mike Johnson', avatar: null,  x: 'mikejohnson', email: 'mike@example.com', linkedin: 'mikejohnson' }
		]
	};

	const demoSchedule = [
		{
			time: '9:00 AM',
			projectName: 'AI-Powered Project Management',
			team: ['John Doe', 'Jane Smith', 'Mike Johnson']
		},
		{
			time: '9:30 AM',
			projectName: 'Smart Home Automation',
			team: ['Alice Brown', 'Bob Wilson']
		},
		{
			time: '10:00 AM',
			projectName: 'Healthcare Analytics Platform',
			team: ['Carol Davis', 'David Clark']
		}
	];

	let showControls = $state(false);
	let videoContainer: HTMLDivElement;
	let selectedPersonId = $state<string | null>(null);

	function handlePlayClick() {
		showControls = true;
		// Focus on iframe for keyboard controls
		const iframe = videoContainer.querySelector('iframe');
		if (iframe) {
			iframe.focus();
		}
	}

	function handlePersonClick(id: string) {
		selectedPersonId = id;
		
		// Find the selected team member
		const selectedMember = currentDemo.team.find(member => member.id === id);
		if (selectedMember) {
			// Update dock state with member's social links and set expanded to true
			updateDockState(
				true,
				selectedMember.x,
				selectedMember.linkedin,
				selectedMember.github,
				selectedMember.email
			);
		}
	}

	function handleBack() {
		selectedPersonId = null;
		// Reset dock state when unselecting a member
		//updateDockState(false, null, null, null, null);
        toggleDockExpanded();
	}
</script>

<div
	class="min-h-screen bg-gradient-to-br from-background to-secondary/20 dark:from-background/90 dark:to-secondary"
>
	<main class="container mx-auto px-4 py-8">
		<!-- Main Content -->
		<div
			class="rounded-2xl border border-border bg-background/85 backdrop-blur-md shadow-lg p-6 md:p-8"
		>
			<h1 class="text-3xl md:text-4xl font-bold text-foreground mb-6">Demo Day Live</h1>

			<!-- Video and Presenter Details Layout -->
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
				<!-- Video Stream Placeholder - keep col-span-2 -->
				<div class="lg:col-span-2">
					<div 
						class="w-full aspect-video bg-muted rounded-xl overflow-hidden relative"
						bind:this={videoContainer}
					>
						<div class="absolute inset-0">
							<!-- Always present iframe, but hidden initially -->
							<div class={`absolute inset-0 ${showControls ? 'z-10' : 'opacity-0'}`}>
                                <!--https://stackoverflow.com/questions/39275889/how-to-embed-new-youtubes-live-video-permanent-url-->
								<iframe
									class="w-full h-full absolute inset-0"
									src="https://youtube.com/embed/r9lcXUv9Tn4?enablejsapi=1&autoplay=1"
									title="YouTube video player"
									frameborder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowfullscreen
								></iframe>
							</div>

							<!-- Thumbnail overlay -->
							<div 
								class={`absolute inset-0 transition-opacity duration-300 ${showControls ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
							>
								<img 
									src="imgs/video-placeholder.webp" 
									alt="Video thumbnail" 
									class="w-full h-full object-cover"
								/>
								
								<!-- Custom play button -->
								<button
									class="absolute inset-0 w-full h-full flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors group"
									onclick={() => window.open('https://x.com/i/broadcasts/1yNxaLMeparJj', '_blank')}
								>
									<div class="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
										<svg 
											class="w-8 h-8 md:w-10 md:h-10 text-primary-foreground" 
											fill="currentColor" 
											viewBox="0 0 24 24"
										>
											<path d="M8 5v14l11-7z"/>
										</svg>
									</div>
								</button>
							</div>
						</div>
					</div>
				</div>

				<!-- Presenter Details Sidebar - fixed height container -->
				<div class="lg:col-span-1">
					<div class="h-[485px] rounded-xl  bg-card">
						<div class="h-full p-6 flex flex-col">
							{#if selectedPersonId}
								<PeopleDetailedView 
									personId={selectedPersonId} 
									onBack={handleBack}
								/>
							{:else}
								<!-- Project Details with reduced margins -->
								<div class="mb-4">
									<h2 class="text-lg md:text-2xl font-bold text-foreground mb-2">
										{currentDemo.projectName}
									</h2>
									<p class="text-muted-foreground line-clamp-3">
										{currentDemo.description}
									</p>
								</div>
                                

								<!-- Current Team with adjusted spacing -->
								<div class="flex-1">
									<div class="flex items-center gap-2 mb-3">
										<Users size={18} class="text-foreground" />
										<h3 class="text-base font-semibold text-foreground">Presenting Team</h3>
                                        
									</div>
                                    <Separator />
									<ul class="space-y-2 mt-2">
										{#each currentDemo.team as member}
											<li>
												<button
													class="flex items-center gap-2 w-full hover:bg-muted/50 p-1.5 rounded-lg transition-colors"
													onclick={() => handlePersonClick(member.id)}
												>
													<div class="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
														{member.name[0]}
													</div>
													<span class="text-primary text-base">{member.name}</span>
												</button>
											</li>
										{/each}
									</ul>
								</div>
							{/if}
						</div>
					</div>
				</div>
			</div>

			<!-- Schedule Section -->
			<!-- <h2 class="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
				<Calendar size={24} />
				Coming Up...
			</h2> -->
			<TabView team={currentDemo.team} />
		</div>
	</main>
</div>
