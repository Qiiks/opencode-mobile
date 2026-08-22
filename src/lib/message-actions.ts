// Pure helper: decide which actions a long-press on a message may offer.
//
// Kept React-free so it can be unit-tested under plain `node --test` (same
// pattern as message-copy-text.ts) and so the session screen's long-press
// handler stays a thin wrapper: it computes two booleans and renders whatever
// this returns.
export type MessageAction = "copy" | "select" | "edit" | "undo"

export function buildMessageActions(opts: { isUser: boolean; canCopy: boolean }): MessageAction[] {
  const actions: MessageAction[] = []
  if (opts.canCopy) {
    actions.push("copy", "select")
  }
  if (opts.isUser) {
    actions.push("undo", "edit")
  }
  return actions
}
