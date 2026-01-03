# Upgrade Notes

## Next.js 16 Upgrade

**Status:** ⏸️ Planned for February-March 2026
**Current Version:** Next.js 15.5.9
**Target Version:** Next.js 16.x

### Quick Reference

A comprehensive upgrade guide is available on the `upgrade/nextjs-16` branch.

**To view the guide:**
```bash
git checkout upgrade/nextjs-16
cat NEXTJS-16-UPGRADE-GUIDE.md
```

**Or view on GitHub:**
Navigate to the `upgrade/nextjs-16` branch and open `NEXTJS-16-UPGRADE-GUIDE.md`

### Why We're Waiting

- Next.js 16 has breaking changes requiring code updates
- Official migration documentation incomplete (as of Jan 2026)
- `revalidateTag()` API changed (15+ calls need updating)
- Waiting 4-8 weeks for better community support

### When to Upgrade

Check these conditions in **mid-February 2026:**
- [ ] Official migration guide published
- [ ] `revalidateTag()` new API documented
- [ ] Community examples available
- [ ] Next.js 16.2.0+ released (bug fixes)

### What's Already Prepared

✅ Upgrade branch created with Next.js 16.1.1
✅ Breaking changes identified and documented
✅ Test environment ready
✅ Rollback plan in place

### Quick Start (When Ready)

```bash
# Switch to upgrade branch
git checkout upgrade/nextjs-16

# Read the full guide
cat NEXTJS-16-UPGRADE-GUIDE.md

# Follow the step-by-step process
# Test thoroughly before merging!
```

---

**Last Updated:** January 3, 2026
**Review Again:** Mid-February 2026
