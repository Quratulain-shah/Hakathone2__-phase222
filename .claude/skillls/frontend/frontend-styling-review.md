---
name: frontend-styling-review
description: "Authoritative guide for reviewing and enforcing consistent, performant, accessible, and responsive Tailwind CSS styling across all Todo App Phase 2 frontend components using mobile-first principles and design system standards."
version: "1.0"
tags: ["frontend", "tailwind", "styling", "accessibility", "responsive", "ui-review"]
author: "Spec-Kit Plus Intelligence Architect"
type: skill
complexity: medium
decision_points: 6
---

# Frontend Styling Review Skill

## Metadata
- **Version**: 1.0
- **Created**: 2025-12-26
- **Category**: Frontend UI/UX
- **Complexity Level**: Medium (6 decision points)
- **Reusability**: Cross-project (any Next.js + Tailwind project)

## Description

This skill provides the definitive standards for reviewing Tailwind CSS styling in Todo App Phase 2 frontend components. It ensures visual consistency, performance (no inline styles), accessibility (contrast, focus states), responsiveness (mobile-first), and adherence to the established design system across all pages and components.

## When to Use This Skill

**Apply when:**
- Reviewing new or updated components in `/components/` or `/app/`
- Implementing UI from feature specs (task cards, forms, lists)
- Auditing existing styles for consistency
- Validating responsive behavior and accessibility
- Before finalizing frontend implementation tasks

**Skip when:**
- Non-visual logic (API calls, state management)
- Server Component data fetching only
- Backend or database changes
- Initial component structure (use frontend-component-design skill first)

## Persona

You are a **Senior UI/UX Engineer** who reviews styling with the precision of an accessibility auditor and the eye of a design system guardian. You think systematically about:

- **Consistency as Brand**: Every component must feel like part of the same app
- **Performance Through Discipline**: Tailwind classes only – no bloat or overrides
- **Accessibility by Default**: Contrast, focus, semantics for all users
- **Mobile-First Reality**: 80% users on mobile – design for small screens first
- **User Delight**: Subtle interactions, clear hierarchy, intuitive feedback

Your goal is to approve only styling that is:
- Visually cohesive and professional
- Fast-loading and performant
- Inclusive for all users/devices
- Maintainable across hackathon phases

## Analytical Questions

Before approving styling implementation, systematically analyze:

### 1. Tailwind Usage & Purity
- Are all styles implemented with Tailwind utility classes only?
- Is there any inline style={{}} or external CSS?
- Are class names ordered consistently (layout → sizing → typography → colors → effects)?
- Are arbitrary values minimized (prefer design tokens)?

### 2. Responsive Design Implementation
- Is mobile-first approach followed (base styles, then sm/md/lg overrides)?
- Do layouts adapt properly on small screens (stacked, hidden overflow)?
- Are text sizes and spacing legible on mobile?
- Touch targets at least 44x44px?

### 3. Accessibility Compliance
- Color contrast meets WCAG AA (4.5:1 text, 3:1 large)?
- Focus states visible (outline or ring on interactive elements)?
- Semantic colors used (text-gray-900 not hardcoded #000)?
- Reduced motion respected (@media (prefers-reduced-motion))?

### 4. Design System Consistency
- Spacing follows 4px grid (p-4, gap-6, etc.)?
- Typography scale consistent (text-sm, text-lg, text-3xl)?
- Colors from established palette (blue-600 primary, gray-200 borders)?
- Component variants match existing patterns (buttons, cards)?

### 5. Visual Hierarchy & Feedback
- Clear content hierarchy (headings, emphasis)?
- Interactive states (hover, active, disabled) styled?
- Loading/error states visually distinct?
- Empty states handled with proper messaging/layout?

### 6. Performance & Bundle Impact
- No duplicate or conflicting classes?
- Dark mode classes applied correctly (dark:bg-gray-900)?
- Transitions/animations subtle and purposeful?
- No over-use of shadow or blur for performance?

## Decision Principles

Apply these frameworks when reviewing styling:

### 1. Tailwind Class Order Standard
**Principle**: Consistent ordering for readability

Order: layout → flex/grid → sizing → padding/margin → typography → colors → borders → effects → interactions

**Example**:
```tsx
<div className="flex flex-col md:flex-row gap-6 p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200">
```

### 2. Responsive Breakpoint Rules
**Principle**: Mobile-first, explicit overrides

| Breakpoint | Use Case | Example |
|------------|----------|---------|
| base       | Default mobile | flex-col |
| sm (640px) | Small tablets | sm:flex-row |
| md (768px) | Tablets | md:gap-8 |
| lg (1024px)| Desktop | lg:grid-cols-3 |
| xl (1280px)| Large | xl:max-w-7xl |

**Never** use min-width without base mobile styles.

### 3. Accessibility Standards Table
**Principle**: Inclusive by default

| Requirement | Implementation | Check |
|-------------|----------------|-------|
| Contrast    | text-gray-900 on white | AA compliant |
| Focus       | focus:ring-2 focus:ring-blue-500 | Visible outline |
| Touch       | min-h-11 min-w-11 | 44px minimum |
| Motion      | @media (prefers-reduced-motion: reduce) | No forced animation |

### 4. Design Token Usage
**Principle**: No magic values

**Allowed**:
- bg-blue-600, text-gray-900, border-gray-200
- p-4, gap-6, rounded-lg, shadow-sm

**Prohibited**:
- bg-[#1e40af], text-16px, p-[32px]

### 5. Component State Patterns
**Principle**: Visual feedback for all states

```tsx
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
```

## Usage Example

**Scenario**: Reviewing TaskCard component styling

**Invocation**:
```
Apply frontend-styling-review skill to TaskCard component implementation
```

**Expected Output**:
```
=== STYLING REVIEW ===
Component: TaskCard

--- TAILWIND PURITY ---
✓ 100% utility classes
✗ Inline style on button (remove!)
✓ Consistent class ordering

--- RESPONSIVE ---
✓ Mobile: stacked layout
✓ md: side-by-side status/button
✓ Touch targets >44px

--- ACCESSIBILITY ---
✓ Contrast: 7:1 on text
✓ Focus ring on button
✓ Hover and disabled states clear

--- CONSISTENCY ---
✓ Matches Card pattern (rounded-xl, shadow-sm)
✓ Colors from palette (blue-600 primary)
✓ Spacing on 4px grid

--- FEEDBACK STATES ---
✓ Hover shadow increase
✓ Disabled opacity
✓ Loading state skeleton

--- REQUIRED FIXES ---
1. Remove inline style={{ opacity: isLoading ? 0.5 : 1 }}
2. Add focus-visible:ring for keyboard users

--- VERDICT ---
Status: REVISE (2 minor fixes)
Ready for approval after changes
```

## Self-Check Validation

After reviewing styling, verify:

- [ ] No inline styles or external CSS
- [ ] Mobile-first responsive implementation
- [ ] WCAG AA contrast and focus states
- [ ] Consistent with design system tokens
- [ ] Clear visual hierarchy
- [ ] All interactive states styled
- [ ] Touch-friendly on mobile
- [ ] Subtle, performant transitions
- [ ] Empty/loading/error states handled
- [ ] Class names ordered consistently

## Integration with SDD Workflow

**In Implement Phase**:
- Apply after component structure
- Final check before frontend PR

**With Other Skills**:
- Follows frontend-component-design
- Informs accessibility in feature-edge-case

**Pre-Deploy Gate**:
- All components pass styling review

## Common Mistakes This Skill Prevents

1. **Inline Styles**: Performance and consistency killer
2. **Desktop-Only**: Broken mobile experience
3. **Poor Contrast**: Inaccessible to color blind users
4. **No Focus States**: Keyboard navigation broken
5. **Inconsistent Spacing**: Feels like different apps
6. **Magic Colors**: Hard to maintain theme

## Skill Evolution Notes

**Future enhancements**:
- Dark mode full support
- Animation library integration
- Component library extraction
- Automated style linting rules

---

**Skill Status**: Production Ready
**Last Updated**: 2025-12-26
**Maintenance**: Review with design system updates

---

