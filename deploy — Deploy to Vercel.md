# /deploy — Deploy to Vercel

Pre-flight checks and deployment workflow for NovaLearning games.

## Instructions

Run deployment checklist then deploy to Vercel.

### Pre-flight Checks (ALL must pass):

1. **Build**: Run `npm run build` or `next build`. Must complete without errors.
2. **Bundle Size**: Verify total output < 500KB (Galaxy A03 constraint).
3. **TypeScript**: No type errors (`npx tsc --noEmit`).
4. **Lint**: Run `npm run lint` if configured. No errors.
5. **Environment Variables**: Verify `.env.local` vars are set in Vercel dashboard.
6. **Performance**: Run /gamecheck if game files present.

### Deploy Steps:

1. Run pre-flight checks above
2. If all pass: `vercel --prod` (or use Vercel MCP tool)
3. Capture deployment URL
4. Test deployment URL loads correctly
5. Report deployment status

### Output format:

```
## 🚀 Deployment Report

### Pre-flight
- Build: ✅/❌
- Bundle: XXX KB (limit: 500KB) ✅/❌
- TypeScript: ✅/❌
- Lint: ✅/❌
- Env vars: ✅/❌

### Deployment
- URL: [deployment URL]
- Status: [success/failed]
- Duration: [build time]

### Post-deploy
- [ ] Test on mobile viewport
- [ ] Check Galaxy A03 performance
- [ ] Verify QR code triggers work
```

If pre-flight fails, stop and report issues. Do NOT deploy with failures.
