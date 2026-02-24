# /plan — Create Project Plan

Generate a structured projectplan.md for the current task.

## Instructions

Create a projectplan.md following NovaLearning's standard template. Use $ARGUMENTS as the task description.

### Steps:

1. **Understand the goal**: Parse the task description. Ask clarifying questions only if truly ambiguous.

2. **Check existing assets**:
   - Search relevant GitHub repos (249 available)
   - Check if similar functionality exists in RangerNova, Counting-Safari, or other repos
   - Identify reusable code, components, or patterns

3. **Identify MCP tools**: Which of the 25+ MCP tools can accelerate this task?

4. **Estimate effort**: Break into tasks with time estimates. Flag if total exceeds 2 hours (should be split).

5. **Write projectplan.md** with this structure:

```markdown
# PROJECT: [Task Name]
Date: [Today] | Status: Planning

## Objective
[One sentence: what we're building and why]

## Assets Available
- Repos: [specific repos we're using]
- MCP Tools: [tools that will help]
- Files: [existing code we're modifying]

## Plan
### Todo List
- [ ] 1. [Specific task] (Est: Xmin)
- [ ] 2. [Specific task] (Est: Xmin)
- [ ] 3. [Specific task] (Est: Xmin)
Total estimated: X minutes

### Alternative Approaches
1. [Alt 1] - Rejected because [reason]
2. [Chosen approach] - Best because [reason]

### Risk Assessment
- [Risk 1]: [Mitigation]
- [Risk 2]: [Mitigation]

### Galaxy A03 Impact
[Only if game-related: performance implications]

### Ubuntu Alignment
[Only if game-related: philosophy check]
```

6. **STOP and wait for approval** before any implementation.

### Key Rules:
- Always check repos before suggesting new builds
- Include time estimates for every task
- Flag tasks over 2 hours as needing decomposition
- Include at least one alternative approach considered
