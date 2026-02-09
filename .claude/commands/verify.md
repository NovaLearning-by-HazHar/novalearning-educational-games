Run the full NovaLearning verification checklist:

1. TypeScript check: `npx tsc --noEmit`
2. ESLint: `npm run lint`
3. Build: `npm run build`
4. After build completes, report the "First Load JS" sizes from the build output
5. Compare game page size against 500KB budget — flag if over 400KB (80%)
6. Check for Ubuntu violations: grep `src/` for these forbidden patterns:
   - "score", "leaderboard", "winner", "loser", "game over", "wrong", "fail", "try harder", "points"
   - Any imports from firebase, @firebase, or react-native
   - Any references to WebGL2, WebGL2RenderingContext, or computeShader
7. Check complexity: report any file in `src/` exceeding 200 lines

Report results as:
- TSC: PASS/FAIL (error count)
- Lint: PASS/FAIL (warning count)
- Build: PASS/FAIL
- Bundle: HOME=xxxKB GAME=xxxKB (% of 500KB)
- Ubuntu: CLEAN / VIOLATIONS FOUND (list)
- Complexity: CLEAN / FILES OVER 200 LINES (list)

If any check fails, fix the issue and re-verify until all pass.
