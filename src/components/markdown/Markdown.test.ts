import { test } from "node:test"
import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

// GitHub issue: BUG 5 — inline <code> (codespan) pills overlap the line
// below. The codespan style carried its own padding but no lineHeight, so the
// padded pill outgrew the parent text's 22px line box and collided with the
// next line.
//
// This repo's runtime is React Native, so the theme objects can't be imported
// from the .tsx source (Node strips types but cannot transform JSX, and the
// file pulls in react-native modules — same limitation documented in
// wide-content-scroll.regression.test.ts). Instead we read the source and
// assert on structure: the codespan style must declare the SAME lineHeight as
// the paragraph text style, and darkTheme must inherit it via spread.

const here = path.dirname(fileURLToPath(import.meta.url))
const source = readFileSync(path.join(here, "Markdown.tsx"), "utf8")

// Return the brace-delimited body of the first `<needle>` style object in the
// file (e.g. `text: {` or `codespan: {`), or null if not found.
function findObjectBody(needle: string): string | null {
  const idx = source.indexOf(needle)
  if (idx === -1) return null
  const open = source.indexOf("{", idx)
  if (open === -1) return null
  let depth = 0
  for (let i = open; i < source.length; i++) {
    const c = source[i]
    if (c === "{") depth++
    else if (c === "}") {
      depth--
      if (depth === 0) return source.slice(open, i + 1)
    }
  }
  return null
}

function lineHeightOf(body: string | null): string | undefined {
  if (!body) return undefined
  return (body.match(/lineHeight:\s*(\d+)/) || [])[1]
}

test("lightTheme.codespan declares a lineHeight matching the paragraph text lineHeight", () => {
  const textBody = findObjectBody("text: {")
  const codespanBody = findObjectBody("codespan: {")

  const textLH = lineHeightOf(textBody)
  const codespanLH = lineHeightOf(codespanBody)

  assert.ok(textBody, "theme must define a `text` style")
  assert.ok(codespanBody, "theme must define a `codespan` style")
  assert.ok(textLH, "paragraph `text` style must declare a lineHeight")
  assert.ok(
    codespanLH,
    "BUG 5: `codespan` style must declare a lineHeight so the padded pill does not overlap the next line",
  )
  assert.equal(codespanLH, textLH, "codespan lineHeight must match the paragraph text lineHeight")
})

test("darkTheme.codespan inherits lightTheme.codespan via spread", () => {
  // darkTheme redefines codespan as `...lightTheme.codespan` plus color
  // overrides. As long as that spread remains, adding lineHeight to the light
  // theme automatically fixes the dark theme too.
  assert.match(source, /\.\.\.lightTheme\.codespan/, "darkTheme.codespan must spread lightTheme.codespan")
})
