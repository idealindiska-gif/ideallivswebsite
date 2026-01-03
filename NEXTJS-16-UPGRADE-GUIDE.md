# Next.js 16 Upgrade Guide

**Last Updated:** January 3, 2026
**Current Version:** Next.js 15.5.9
**Target Version:** Next.js 16.1.x+
**Status:** ⏸️ Waiting for better documentation

---

## Table of Contents
1. [When to Upgrade](#when-to-upgrade)
2. [Known Breaking Changes](#known-breaking-changes)
3. [Pre-Upgrade Checklist](#pre-upgrade-checklist)
4. [Upgrade Process](#upgrade-process)
5. [Troubleshooting](#troubleshooting)
6. [Resources](#resources)

---

## When to Upgrade

### ✅ Safe to Upgrade When:
- [ ] Official migration guide published on nextjs.org
- [ ] Next.js 16.2.0+ released (bug fixes from initial release)
- [ ] Community has documented solutions for breaking changes
- [ ] `revalidateTag()` API change is documented
- [ ] You have 4-8 hours available for testing
- [ ] Not during peak business periods (avoid holiday seasons)

### ⏰ Recommended Timeline:
- **Early February 2026:** Check for migration guides
- **Mid-February 2026:** Test upgrade on this branch
- **Late February/March 2026:** Production deployment if stable

### 🚫 Don't Upgrade If:
- Critical launch or sale happening soon
- No time for thorough testing
- Documentation still incomplete
- Multiple breaking changes unresolved

---

## Known Breaking Changes

### 1. ❌ revalidateTag() API Changed ⚠️ BLOCKER

**Location:** `app/api/revalidate/route.ts`
**Issue:** Function signature changed from 1 to 2 arguments

**Current Code (Next.js 15):**
```typescript
revalidateTag("wordpress");
revalidateTag("posts");
revalidateTag(`post-${contentId}`);
```

**Error Message:**
```
Type error: Expected 2 arguments, but got 1.
app/api/revalidate/route.ts:42:7
```

**Files Affected (15+ calls):**
```
app/api/revalidate/route.ts
- Line 42: revalidateTag("wordpress")
- Line 45: revalidateTag("posts")
- Line 47: revalidateTag(`post-${contentId}`)
- Line 50: revalidateTag("posts-page-1")
- Line 52: revalidateTag("categories")
- Line 54-55: Category-specific tags
- Line 58: revalidateTag("tags")
- Line 60-61: Tag-specific tags
- Line 64: revalidateTag("authors")
- Line 66-67: Author-specific tags
```

**What to Research:**
- [ ] Check Next.js 16 docs for new `revalidateTag()` signature
- [ ] Find community examples on GitHub
- [ ] Test if it requires `await` (async)
- [ ] Check if second parameter is options object

**Possible Solutions to Try:**
```typescript
// Option 1: Async
await revalidateTag("posts");

// Option 2: Options object
revalidateTag("posts", {});

// Option 3: Different import
import { revalidateTag } from "next/cache";
```

---

### 2. ✅ swcMinify Deprecated (FIXED)

**Location:** `next.config.js`
**Status:** ✅ Already removed on master branch

**What Was Done:**
```javascript
// Removed this line:
swcMinify: true,

// Reason: Always enabled in Next.js 15+, deprecated in 16
```

---

### 3. ✅ 'use server' in API Routes (FIXED)

**Location:** `app/api/test-wc-customer/route.ts`
**Status:** ✅ Already removed on master branch

**What Was Done:**
```typescript
// Removed this from top of file:
'use server';

// Reason: 'use server' is for Server Actions, not API Routes
// Caused type generation errors in Next.js 16
```

---

### 4. ⚠️ Middleware Convention Warning

**Warning Message:**
```
⚠ The "middleware" file convention is deprecated.
Please use "proxy" instead.
```

**Status:** ⚠️ Needs investigation
**Issue:** No middleware file found, might be false warning

**What to Check:**
- [ ] Search for any middleware files: `middleware.ts/js`
- [ ] Check if subdirectories have middleware
- [ ] Read Next.js 16 docs about "proxy" convention
- [ ] Might be safe to ignore if no middleware exists

---

### 5. ✅ TypeScript Config Auto-Update (HANDLED)

**Location:** `tsconfig.json`
**Change:** `jsx: "preserve"` → `jsx: "react-jsx"`

**Status:** Reverted to preserve when staying on Next.js 15
**Action Needed:** Accept this change when upgrading to 16

---

## Pre-Upgrade Checklist

### Before Starting:

- [ ] Read official Next.js 16 migration guide
- [ ] Check this branch is up to date with master
- [ ] Backup production database
- [ ] Review Next.js 16 changelog
- [ ] Check if third-party packages compatible
- [ ] Notify team of potential downtime
- [ ] Schedule during low-traffic period

### Required Resources:

```bash
# Check these before upgrading:
- Next.js Blog: https://nextjs.org/blog
- Migration Guide: https://nextjs.org/docs/upgrading
- GitHub Releases: https://github.com/vercel/next.js/releases
- Community Discussions: https://github.com/vercel/next.js/discussions
```

---

## Upgrade Process

### Step 1: Prepare Environment

```bash
# Switch to upgrade branch
git checkout upgrade/nextjs-16

# Ensure branch is up to date with master
git merge master

# Check current status
node --version  # Should be 20.9.0+
npm --version
```

---

### Step 2: Update Next.js

```bash
# Clean install
rm -rf node_modules package-lock.json .next

# Update to latest Next.js 16
npm install next@latest --legacy-peer-deps

# Verify version
npm list next
# Should show: next@16.x.x
```

---

### Step 3: Fix Breaking Changes

#### A. Fix revalidateTag() Calls

**File:** `app/api/revalidate/route.ts`

1. Read the official Next.js 16 docs for new signature
2. Update all 15+ revalidateTag calls
3. Pattern to find all calls:
   ```bash
   grep -n "revalidateTag" app/api/revalidate/route.ts
   ```

**Template for fixes:**
```typescript
// UPDATE THIS BASED ON OFFICIAL DOCS
// Example (verify correct syntax first):

// If async is required:
await revalidateTag("posts");

// If options needed:
revalidateTag("posts", { /* check docs */ });
```

#### B. Handle Middleware Warning (if applicable)

1. Search for middleware:
   ```bash
   find . -name "middleware.*" -type f
   ```

2. If found, read proxy documentation
3. Follow Next.js 16 proxy migration guide

---

### Step 4: Build and Test

```bash
# Clear build cache
rm -rf .next

# Run type check
npm run type-check

# Build for production
npm run build

# If build succeeds, start dev server
npm run dev

# Open: http://localhost:3000
```

**Test Checklist:**
- [ ] Home page loads
- [ ] Product pages load
- [ ] Search works
- [ ] Cart functionality
- [ ] Checkout process
- [ ] API routes respond
- [ ] WordPress revalidation webhook
- [ ] Admin features
- [ ] Mobile responsive
- [ ] No console errors

---

### Step 5: Performance Check

```bash
# Build production bundle
npm run build

# Check bundle sizes
du -sh .next/static/*

# Compare with Next.js 15 build:
# - Turbopack should be faster
# - Bundle might be smaller
```

**Metrics to Compare:**
- Build time (should be faster with Turbopack)
- Bundle size
- Page load times
- Lighthouse scores

---

### Step 6: Commit Changes

```bash
# Review all changes
git status
git diff

# Commit the upgrade
git add .
git commit -m "feat: Upgrade to Next.js 16.x

Breaking changes fixed:
- Updated revalidateTag() API calls
- [List other fixes]

Tested:
- All critical user flows
- API endpoints
- Build process
- Performance metrics

Next.js 16.x.x with Turbopack"

# Don't merge yet - deploy to staging first!
```

---

### Step 7: Staging Deployment

```bash
# Deploy to Vercel preview
vercel --branch upgrade/nextjs-16

# OR deploy to your staging environment
# [Add your staging deployment commands]

# Test thoroughly on staging:
# - Real data
# - Real traffic patterns
# - All integrations (Stripe, WordPress, etc.)
```

**Staging Test Duration:** 24-48 hours minimum

---

### Step 8: Production Deployment

**Only proceed if:**
- ✅ All tests pass on staging
- ✅ No errors in staging logs
- ✅ Performance equal or better
- ✅ Team approves deployment

```bash
# Merge to master
git checkout master
git merge upgrade/nextjs-16

# Final check
npm run build

# Push to production
git push origin master

# Monitor deployment
# Watch logs for errors
# Check analytics for issues
```

**Post-Deployment:**
- [ ] Monitor error tracking (first 2 hours)
- [ ] Check Core Web Vitals
- [ ] Test critical flows
- [ ] Review user feedback
- [ ] Have rollback plan ready

---

## Troubleshooting

### Build Fails with Type Errors

**Solution:**
```bash
# Clear all caches
rm -rf .next node_modules package-lock.json
npm install --legacy-peer-deps
npm run build
```

---

### revalidateTag Errors Persist

**Check:**
1. Did you update ALL occurrences? (15+ in revalidate/route.ts)
2. Is the new syntax correct per official docs?
3. Try temporarily disabling type checking to isolate issue

---

### Turbopack Issues

**If dev server crashes:**
```bash
# Try without Turbopack
npm run dev -- --no-turbo

# Or update dev script in package.json:
"dev": "next dev"  # Remove --turbo flag
```

---

### Performance Regression

**Compare metrics:**
```bash
# Lighthouse before
npm run build && npm start
# Run Lighthouse

# Check bundle analysis
npm install @next/bundle-analyzer
```

---

### Rollback Plan

**If critical issues found:**

```bash
# Quick rollback
git checkout master
git revert HEAD  # If already merged
git push origin master --force

# Or deploy previous version
vercel --prod [previous-deployment-url]

# Reinstall Next.js 15
npm install next@15.5.9 --legacy-peer-deps
```

---

## Resources

### Official Documentation
- Next.js 16 Announcement: https://nextjs.org/blog
- Migration Guide: https://nextjs.org/docs/upgrading
- API Reference: https://nextjs.org/docs/api-reference
- Turbopack Docs: https://nextjs.org/docs/architecture/turbopack

### Community Resources
- GitHub Releases: https://github.com/vercel/next.js/releases
- Discussions: https://github.com/vercel/next.js/discussions
- Discord: https://nextjs.org/discord
- Reddit: r/nextjs

### Search Queries for Solutions
```
"next.js 16 revalidateTag migration"
"next.js 16 breaking changes"
"next.js 16 upgrade guide"
"next.js 15 to 16 migration"
```

---

## Notes from Previous Upgrade Attempt

**Date:** January 3, 2026
**Attempted By:** Claude Code Assistant

**What Worked:**
- ✅ Installation successful (Next.js 16.1.1)
- ✅ Dev server started (29.9s with Turbopack - very fast!)
- ✅ Turbopack compilation working
- ✅ TypeScript auto-configuration

**What Failed:**
- ❌ Production build failed on revalidateTag type error
- ❌ No clear documentation for new API
- ❌ 15+ calls need updating

**Decision:** Reverted to Next.js 15.5.9 for stability

**Recommendation:** Retry in 4-8 weeks when:
- Official migration guide available
- revalidateTag API documented
- Community has working examples

---

## Current Status Summary

**Branch:** `upgrade/nextjs-16`
**Status:** On hold pending documentation
**Master Branch:** Next.js 15.5.9 (stable)
**Next Review:** Mid-February 2026

**Quick Start When Ready:**
```bash
git checkout upgrade/nextjs-16
git merge master
npm install next@latest --legacy-peer-deps
# Follow steps above
```

---

## Questions to Answer Before Upgrading

- [ ] Is the new revalidateTag() syntax documented?
- [ ] Are there any new required configurations?
- [ ] Do all our dependencies support Next.js 16?
- [ ] What are the Turbopack limitations?
- [ ] Are there any router changes affecting our code?
- [ ] How does this affect our WordPress integration?
- [ ] What's the rollback process if issues arise?

---

**Good luck with the upgrade! 🚀**

*Update this document as you learn more about Next.js 16.*
