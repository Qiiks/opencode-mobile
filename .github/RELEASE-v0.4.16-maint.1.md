# v0.4.16-maint.1 — community maintenance

Maintenance release on top of upstream `v0.4.15` (`646f9cbf`), merging three outstanding upstream PRs that had been waiting on review. Debug-signed APK (see notes below); treat as a prerelease.

## Merged PRs

### #182 — fix(android): keyboard/composer, auto-scroll, SSE recovery + startup, copyable text (@omgoshjosh)
Closes #156 (input hidden behind keyboard), #155 (auto-scroll), #186 (dead SSE never recovered), #189 (SSE startup blocked behind metadata fetches); also fixes stale transcripts after reconnect, uncopyable assistant text, axis-perfect horizontal scrolling for code/diffs/tables, 50-session list cap paging, transcript flash, dark-mode contrast.
Validated by the author on physical Pixel 3 XL hardware (Android 12) plus emulator airplane-mode tests.

### #191 — fix(chat): preserve per-session composer drafts (@chliny)
Unsent composer text is stored per session ID, restored on navigation, cleared on send, removed when its session is deleted. In-memory only.

### #192 — feat(chat): fullscreen diffs and task change review (@chliny)
Fullscreen content viewer for code / tool output / diffs; colored unified diff rendering including `apply_patch` tool calls; end-of-task "Review Changes" section derived from session messages; regression-tested diff parsing.

## Integration work done during the merge
- PR #182 deleted `src/lib/scroll-config.ts`; #192 still referenced it. All call sites were ported onto #182's gesture-handler-based `WideScroll`, which gained an optional `style` prop so DiffView's `maxHeight` behavior is preserved.
- `app/content-viewer.tsx` (a #192 file referencing the deleted module outside any conflict region) was ported as well.
- Session screen now combines both features: transcript bound guard + review-diff computation in one memoized pass.

## Verification
- `tsc --noEmit`: clean
- Test suite: **390 passed / 0 failed** (`node --test` across all `src/**/*.test.ts` + script tests)

## Known gaps / not yet fixed
- #187 — subagent sessions/status/results UI (targeted next cycle)
- Infra/business issues out of scope for code: #162 (Play registration deadline), #95 (F-Droid reproducible builds), #65 (iOS TestFlight), #134 (OIDC question)

## Install notes
- `opencode-mobile-v0.4.16-maint.1-arm64.apk` — arm64-v8a only, debug-signed (no release keystore on the build host). Android will warn about unknown sources; that's expected for a sideloaded debug-signed build. If you previously installed the official F-Droid/release APK, uninstall it first (signature mismatch).
