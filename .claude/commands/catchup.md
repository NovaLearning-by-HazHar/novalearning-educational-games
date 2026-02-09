Resume a NovaLearning session. Do these steps in order:

1. Read `projectplan.md` — understand current phase, completed work, decisions
2. Read `PROGRESS.md` if it exists — last session's handoff notes
3. Run `git log --oneline -10` — recent commits
4. Run `git status` — uncommitted changes
5. Run `git diff --stat HEAD` — files changed since last commit
6. Run `npm run build` — verify build still passes
7. Summarize: current phase, last completed work, what is next, any blockers
8. Ask: "Ready to continue with [next task]?"
