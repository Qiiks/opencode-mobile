import { test, beforeEach } from "node:test"
import assert from "node:assert/strict"
import { useContentViewer, getContentViewer, setContentViewer, type ContentViewerState } from "./content-viewer.ts"

// BUG 4 ("Open full screen" shows blank content): the content viewer used a
// module-level `let current` to pass content from ContentViewerButton to the
// content-viewer screen. On some devices that did not survive expo-router
// navigation, so the screen read `null` and renderer the empty state. These
// tests lock in the Zustand-store contract that replaces it: an explicit
// set/get round-trip that preserves the object reference, plus a null
// initial state.

beforeEach(() => {
  useContentViewer.setState({ viewer: null })
})

test("content-viewer: initial state is null", () => {
  assert.equal(getContentViewer(), null)
})

test("content-viewer: setContentViewer then getContentViewer returns the same object (round-trip)", () => {
  const state: ContentViewerState = { title: "foo.ts", language: "typescript", content: "const x = 1" }
  setContentViewer(state)

  const got = getContentViewer()

  // Reference equality, not just deep equality: the store must hand back the
  // exact object it was given so a component that reads it after navigation
  // sees the same value that was set before pushing the route.
  assert.equal(got, state)
  assert.equal(got?.title, "foo.ts")
  assert.equal(got?.language, "typescript")
  assert.equal(got?.content, "const x = 1")
})

test("content-viewer: store exposes the viewer on getState for the hook selector", () => {
  setContentViewer({ title: "log.txt", content: "hello" })

  const viewer = useContentViewer.getState().getContentViewer()

  assert.equal(viewer?.title, "log.txt")
  assert.equal(viewer?.content, "hello")
})
