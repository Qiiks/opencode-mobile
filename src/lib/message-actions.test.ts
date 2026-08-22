import { test } from "node:test"
import assert from "node:assert/strict"
import { buildMessageActions } from "./message-actions.ts"

test("user message with copyable text: copy/select + undo/edit", () => {
  assert.deepEqual(buildMessageActions({ isUser: true, canCopy: true }), ["copy", "select", "undo", "edit"])
})

test("user message without copyable text: undo/edit only", () => {
  assert.deepEqual(buildMessageActions({ isUser: true, canCopy: false }), ["undo", "edit"])
})

test("assistant message with copyable text: copy/select only", () => {
  assert.deepEqual(buildMessageActions({ isUser: false, canCopy: true }), ["copy", "select"])
})

test("assistant message without copyable text: no actions", () => {
  assert.deepEqual(buildMessageActions({ isUser: false, canCopy: false }), [])
})
