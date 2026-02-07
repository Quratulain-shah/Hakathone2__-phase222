# Responsive Design Testing Guide - Phase 6

## Overview
This guide covers comprehensive testing for Phase 6: Responsive Design and Mobile Experience implementation.

## Testing Breakpoints

| Breakpoint | Width | Layout Changes | Expected Behavior |
|------------|-------|----------------|-------------------|
| Mobile (sm) | < 640px | Single column | Hamburger menu, FAB visible, full-screen modals |
| Small Tablet | 640-768px | 2 columns | Hamburger menu, FAB visible, full-screen modals |
| Tablet (md) | 768-1024px | 2 columns | Full nav, header button, centered modals |
| Desktop (lg) | >= 1024px | 3 columns | Full nav, header button, centered modals |

## Component-by-Component Testing

### 1. Header Component

**Mobile (< 768px)**:
- [ ] Hamburger menu icon visible on left side
- [ ] Logo and title centered with responsive sizing (h-5 w-5 on mobile)
- [ ] User avatar visible on right (no name or logout button)
- [ ] Navigation hidden, only accessible via hamburger menu

**Tablet/Desktop (>= 768px)**:
- [ ] Hamburger menu hidden
- [ ] Full navigation visible ("My Tasks" link)
- [ ] User avatar + name visible
- [ ] Logout button visible with icon and text

**Keyboard Navigation**:
- [ ] Tab key navigates to hamburger (mobile) or nav links (desktop)
- [ ] Enter activates buttons/links
- [ ] Focus indicators visible on all interactive elements

### 2. MobileNav Component

**Functionality**:
- [ ] Opens when hamburger icon clicked
- [ ] Slides in from left with animation (256px width)
- [ ] Semi-transparent backdrop visible
- [ ] Close button (X icon) in top-right corner
- [ ] Navigation links: "My Tasks"
- [ ] User profile section at bottom with avatar, name, email
- [ ] Logout button at bottom

**Interactions**:
- [ ] Clicking backdrop closes menu
- [ ] Pressing Escape key closes menu
- [ ] Clicking close button closes menu
- [ ] Clicking navigation link closes menu
- [ ] Body scroll disabled when menu open
- [ ] Body scroll restored when menu closed

**Keyboard Navigation**:
- [ ] Tab navigates through menu items
- [ ] Escape closes menu
- [ ] Focus trapped within menu when open

### 3. TaskList Component

**Responsive Grid Layout**:
- [ ] Mobile (< 640px): 1 column, gap-4
- [ ] Tablet (640-1024px): 2 columns, gap-4
- [ ] Desktop (>= 1024px): 3 columns, gap-4
- [ ] Max-width container (max-w-7xl) on desktop

**Add Task Button**:
- [ ] Desktop button (with text) visible only on >= 768px
- [ ] Mobile FAB (floating button) visible only on < 768px
- [ ] FAB positioned bottom-right, 56px × 56px
- [ ] FAB has proper z-index (z-40) above content
- [ ] FAB has shadow for depth
- [ ] FAB shows Plus icon only

**Responsive Features**:
- [ ] Filters and sort controls stack on mobile, horizontal on tablet+
- [ ] Empty state adapts to container width
- [ ] All content readable at minimum width (320px)

### 4. TaskCard Component

**Touch Targets (Mobile)**:
- [ ] All buttons minimum 44px × 44px on mobile
- [ ] Completion toggle: min-h-[44px] min-w-[44px]
- [ ] Edit button: min-h-[44px] min-w-[44px]
- [ ] Delete button: min-h-[44px] min-w-[44px]
- [ ] Proper spacing between buttons (gap-2)

**Button Styling**:
- [ ] Completion toggle: transparent background, hover gray
- [ ] Edit button: gray background (bg-gray-100), hover darker
- [ ] Delete button: red background (bg-red-100), hover darker
- [ ] All buttons have focus rings

**Content Responsive**:
- [ ] Task title truncates properly on small screens
- [ ] Description shows/hides based on content
- [ ] Status badge always visible
- [ ] Created date always visible

### 5. Modal Component

**Mobile (< 640px)**:
- [ ] Modal is full-screen (h-full, w-full)
- [ ] No rounded corners (rounded-none)
- [ ] No padding on backdrop (p-0)
- [ ] Content scrollable within modal
- [ ] Header padding reduced (px-4)

**Tablet/Desktop (>= 640px)**:
- [ ] Modal centered with max-width
- [ ] Rounded corners (sm:rounded-lg)
- [ ] Backdrop padding (sm:p-4)
- [ ] Max height 90vh (sm:max-h-[90vh])
- [ ] Header normal padding (sm:px-6)

**Transitions**:
- [ ] Smooth transition between mobile and desktop layouts
- [ ] Duration 200ms (duration-200)
- [ ] Backdrop fades in/out
- [ ] Modal slides/scales in

**Keyboard Navigation**:
- [ ] Escape key closes modal
- [ ] Focus trapped within modal
- [ ] Focus returns to trigger element on close

## Breakpoint Transition Testing

### 320px (Small Mobile)
- [ ] No horizontal scroll
- [ ] All content readable
- [ ] All buttons tappable
- [ ] Single column layout
- [ ] Hamburger menu functional

### 375px (iPhone SE)
- [ ] Optimal mobile layout
- [ ] FAB doesn't overlap content
- [ ] Proper spacing maintained
- [ ] All features accessible

### 640px (sm breakpoint)
- [ ] Grid transitions to 2 columns
- [ ] Filters remain horizontal or stack based on content
- [ ] Modal still full-screen (wait for 640px+ for centered)
- [ ] FAB still visible

### 768px (md breakpoint)
- [ ] Hamburger menu disappears
- [ ] Full navigation appears
- [ ] FAB disappears
- [ ] Header button appears
- [ ] Modal becomes centered with rounded corners
- [ ] Grid remains 2 columns

### 1024px (lg breakpoint)
- [ ] Grid transitions to 3 columns
- [ ] Max-width container applies
- [ ] Full desktop experience
- [ ] All spacing optimal

### 1440px (Large Desktop)
- [ ] Content centered with max-width
- [ ] No excessive whitespace
- [ ] Readable and accessible

## Keyboard Navigation Checklist

### Global
- [ ] Tab order is logical throughout app
- [ ] Focus indicators visible on all interactive elements
- [ ] No keyboard traps
- [ ] Can navigate entire app without mouse

### Header
- [ ] Tab to hamburger menu (mobile)
- [ ] Tab to logo (not interactive but focusable)
- [ ] Tab to navigation links (desktop)
- [ ] Tab to user avatar (not interactive)
- [ ] Tab to logout button

### Mobile Menu
- [ ] Tab to close button
- [ ] Tab to navigation links
- [ ] Tab to logout button
- [ ] Escape closes menu

### Task List
- [ ] Tab to filter buttons
- [ ] Tab to sort dropdown
- [ ] Tab to add task button (desktop) or FAB (mobile)
- [ ] Tab through task cards

### Task Card
- [ ] Tab to completion toggle
- [ ] Tab to edit button
- [ ] Tab to delete button
- [ ] Enter activates buttons
- [ ] Focus ring visible on all buttons

### Modals
- [ ] Escape closes modal
- [ ] Tab cycles through modal content
- [ ] Focus trapped in modal
- [ ] Focus returns to trigger on close

## Accessibility Testing

### Touch Targets
- [ ] All interactive elements >= 44px on mobile
- [ ] Sufficient spacing between tap targets (min 8px)
- [ ] No overlapping touch areas

### Visual Feedback
- [ ] Hover states on all buttons (desktop)
- [ ] Active states on button press
- [ ] Focus rings on keyboard navigation
- [ ] Loading states show spinner
- [ ] Disabled states visually distinct

### ARIA and Semantics
- [ ] All icon buttons have aria-label
- [ ] Modals have role="dialog" and aria-modal="true"
- [ ] Mobile nav has aria-label
- [ ] Proper heading hierarchy (h1, h2, h3)
- [ ] Semantic HTML used (button, nav, main, header)

### Color Contrast
- [ ] Text meets WCAG AA (4.5:1 for normal, 3:1 for large)
- [ ] Interactive elements visible
- [ ] Status badges readable
- [ ] Focus indicators sufficient contrast

## Performance Testing

### Smooth Transitions
- [ ] Header layout change at 768px is smooth
- [ ] Grid column changes are smooth
- [ ] Modal resize is smooth
- [ ] FAB show/hide is smooth
- [ ] All transitions use 200ms duration

### Animations
- [ ] Mobile menu slide-in animation smooth
- [ ] Backdrop fade-in smooth
- [ ] Modal transitions smooth
- [ ] No janky or stuttering animations

### Layout Shifts
- [ ] No unexpected layout shifts on resize
- [ ] Content doesn't jump during breakpoint transitions
- [ ] Scroll position maintained where appropriate

## Browser Testing

Test on the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## Device Testing

Physical devices or browser DevTools:
- [ ] iPhone SE (375px)
- [ ] iPhone 12/13 (390px)
- [ ] iPhone 14 Pro Max (430px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1440px+)

## Common Issues to Check

### Mobile Menu
- [ ] Body scroll lock works correctly
- [ ] Menu doesn't overlay FAB inappropriately
- [ ] Close button always accessible
- [ ] Backdrop click detection works

### FAB (Floating Action Button)
- [ ] Doesn't overlap important content
- [ ] Z-index sufficient (z-40)
- [ ] Accessible via keyboard
- [ ] Visible on all mobile sizes
- [ ] Hidden at exactly 768px and above

### Grid Layout
- [ ] No horizontal scroll at any breakpoint
- [ ] Columns balanced at all sizes
- [ ] Gap spacing consistent
- [ ] Cards maintain aspect ratio

### Modals
- [ ] Full-screen on mobile works
- [ ] Centered on desktop works
- [ ] Transition between modes smooth
- [ ] Content scrollable when needed
- [ ] Close button always visible

## Manual Testing Flow

1. **Start at 320px width**:
   - Verify hamburger menu
   - Verify FAB visible
   - Verify single column layout
   - Test mobile menu open/close
   - Test task creation via FAB

2. **Resize to 640px**:
   - Verify 2-column grid
   - Verify mobile features still active
   - Test task actions

3. **Resize to 768px**:
   - Verify hamburger disappears
   - Verify full nav appears
   - Verify FAB disappears
   - Verify header button appears
   - Verify modal becomes centered

4. **Resize to 1024px**:
   - Verify 3-column grid
   - Verify full desktop layout
   - Test all features

5. **Test keyboard navigation** at each breakpoint:
   - Tab through all interactive elements
   - Test Escape key functionality
   - Verify focus indicators

## Success Criteria

All checkboxes above must be checked for Phase 6 to be considered complete. Special attention should be paid to:

1. **Touch targets**: All >= 44px on mobile
2. **No horizontal scroll**: At any breakpoint from 320px to 1440px+
3. **Smooth transitions**: All layout changes smooth with 200ms duration
4. **Keyboard accessible**: Every feature accessible via keyboard
5. **Mobile menu**: Fully functional with proper animations and scroll lock
6. **FAB**: Visible only on mobile (< 768px), properly positioned
7. **Grid responsive**: 1, 2, 3 columns at correct breakpoints
8. **Modal responsive**: Full-screen mobile, centered desktop

## Automated Testing (Future)

Consider adding these automated tests in Phase 5:
- Breakpoint detection tests
- Touch target size tests
- Keyboard navigation tests
- Accessibility audit (axe-core)
- Visual regression tests (Chromatic/Percy)

---

**Phase 6 Status**: Ready for Manual Testing
**Last Updated**: 2025-12-26
**Tested By**: [To be filled during testing]
