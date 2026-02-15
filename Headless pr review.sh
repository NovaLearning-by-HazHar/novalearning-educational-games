#!/bin/bash
# headless-pr-review.sh — Automated PR review via Claude Code headless mode
# Usage: ./headless-pr-review.sh [branch-name]
# Runs: claude -p "Review this PR" --headless

set -euo pipefail

BRANCH="${1:-$(git branch --show-current)}"
PROJECT_ROOT="$(git rev-parse --show-toplevel)"
REVIEW_OUTPUT="$PROJECT_ROOT/pr-review-$(date +%Y%m%d-%H%M%S).md"

echo "🔍 Reviewing PR for branch: $BRANCH"
echo "📁 Project: $PROJECT_ROOT"

# Get diff against main
DIFF=$(git diff main..."$BRANCH" --stat)
DIFF_FULL=$(git diff main..."$BRANCH" -- '*.ts' '*.tsx' '*.js' '*.jsx' '*.css' '*.json')
CHANGED_FILES=$(git diff main..."$BRANCH" --name-only)

# Build the prompt
PROMPT="You are reviewing a PR for NovaLearning (web-based 3D educational games for SA Grade R students).

## Changed Files
$CHANGED_FILES

## Diff Summary
$DIFF

## Full Diff
$DIFF_FULL

## Review Checklist
1. **Performance**: Will this run at 60fps on Galaxy A03? (2GB RAM, weak GPU)
   - Bundle impact? (must stay < 500KB)
   - New geometries? (< 10K vertices total)
   - New textures? (max 512px)
   - Memory leaks? (dispose() calls, useEffect cleanup)

2. **Ubuntu Philosophy**: Do any game mechanic changes align with 'I am because we are'?
   - Cooperative over competitive?
   - Helping not defeating?

3. **Code Quality**:
   - TypeScript strict compliance
   - Error boundaries around Three.js canvases
   - No hardcoded strings (i18n ready)
   - DRY principles

4. **Security**: No exposed secrets, proper input validation

## Output Format
Write a structured review as markdown with:
- ✅ Approved items
- ⚠️ Warnings (non-blocking)
- ❌ Critical issues (must fix)
- 💡 Suggestions
- Final verdict: APPROVE / REQUEST CHANGES / NEEDS DISCUSSION"

# Run Claude Code in headless mode
echo "🤖 Running Claude Code review..."
claude -p "$PROMPT" --output-format text > "$REVIEW_OUTPUT" 2>/dev/null || {
  echo "❌ Claude Code headless review failed"
  exit 1
}

echo "✅ Review complete: $REVIEW_OUTPUT"
echo ""
cat "$REVIEW_OUTPUT"
