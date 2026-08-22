import { create } from "zustand"

export interface ContentViewerState {
  title: string
  language?: string
  content: string
}

interface ContentViewerStore {
  viewer: ContentViewerState | null
  setContentViewer: (v: ContentViewerState) => void
  getContentViewer: () => ContentViewerState | null
}

// BUG 4 ("Open full screen" shows blank content): the previous implementation
// passed content from ContentViewerButton to the content-viewer screen via a
// module-level `let current` and read it with a bare getContentViewer() call
// during render. That snapshot approach did not survive expo-router navigation
// on some devices, so the screen read `null` and rendered the empty state.
//
// The content now lives in a Zustand store, and the screen subscribes to it
// with the useContentViewer hook — so it re-renders with the value that was
// set before pushing the /content-viewer route, and the store keeps holding
// that reference across navigation.
export const useContentViewer = create<ContentViewerStore>((set, get) => ({
  viewer: null,
  setContentViewer: (v) => set({ viewer: v }),
  getContentViewer: () => get().viewer,
}))

// Backward-compat thin wrappers for non-hook call sites (e.g.
// ContentViewerButton, which sets the content and immediately pushes the
// route). They read/write the same store the hook subscribes to, so a caller
// that uses the old function API and a screen that uses the hook stay in sync.
export function setContentViewer(v: ContentViewerState): void {
  useContentViewer.getState().setContentViewer(v)
}

export function getContentViewer(): ContentViewerState | null {
  return useContentViewer.getState().getContentViewer()
}
