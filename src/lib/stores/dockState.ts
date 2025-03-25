import { writable } from 'svelte/store';

interface DockState {
  expanded: boolean;
  x: string | null;
  linkedin: string | null;
  github: string | null;
  email: string | null;
}

const initialState: DockState = {
  expanded: false,
  x: null,
  linkedin: null,
  github: null,
  email: null,
};

export const dockState = writable<DockState>(initialState);

export function updateDockState(
  expanded: boolean,
  x?: string | null,
  linkedin?: string | null,
  github?: string | null,
  email?: string | null
) {
  dockState.update((state) => ({
    expanded,
    x: x !== undefined ? x : state.x,
    linkedin: linkedin !== undefined ? linkedin : state.linkedin,
    github: github !== undefined ? github : state.github,
    email: email !== undefined ? email : state.email,
  }));
}

export function toggleDockExpanded() {
  dockState.update((state) => ({
    ...state,
    expanded: !state.expanded,
  }));
}

export function resetDockState() {
  dockState.set(initialState);
}
