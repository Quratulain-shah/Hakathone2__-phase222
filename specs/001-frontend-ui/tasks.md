# Tasks: Todo App Frontend UI

**Input**: Design documents from `/specs/001-frontend-ui/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in spec - manual UI testing only (automated tests deferred to Phase 5 per constitution)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `frontend/src/` for all frontend files
- Frontend structure: `app/` (routes), `components/` (UI), `lib/` (utilities), `contexts/` (state), `hooks/`, `types/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic Next.js 14 structure

- [x] T001 Create Next.js 14 application with TypeScript and Tailwind CSS in frontend/ directory
- [x] T002 Install additional dependencies (lucide-react for icons)
- [x] T003 [P] Configure tailwind.config.js with custom theme (colors, breakpoints)
- [x] T004 [P] Create frontend/src directory structure (app/, components/, lib/, contexts/, hooks/, types/, styles/)
- [x] T005 [P] Configure tsconfig.json with path aliases (@/*)

**Checkpoint**: Project structure ready - foundational components can now be built

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 [P] Create TypeScript interfaces in frontend/src/types/task.ts (Task, TaskStatus)
- [x] T007 [P] Create TypeScript interfaces in frontend/src/types/user.ts (User, AuthState)
- [x] T008 [P] Create TypeScript interfaces in frontend/src/types/ui.ts (UIState, Toast, FilterState)
- [x] T009 [P] Create TypeScript interfaces in frontend/src/types/api.ts (API response types)
- [x] T010 [P] Implement AuthContext in frontend/src/contexts/AuthContext.tsx (mock auth state, session storage)
- [x] T011 [P] Implement TaskContext in frontend/src/contexts/TaskContext.tsx (mock CRUD operations, useState with seed data)
- [x] T012 [P] Implement ToastContext in frontend/src/contexts/ToastContext.tsx (queue management, auto-dismiss)
- [x] T013 [P] Create mock API client in frontend/src/lib/api.ts (50ms delay, error handling)
- [x] T014 [P] Create Server Actions placeholders in frontend/src/lib/actions.ts (createTask, updateTask, deleteTask)
- [x] T015 [P] Create utility functions in frontend/src/lib/utils.ts (formatDate, truncate, cn for className merging)
- [x] T016 [P] Create Button component in frontend/src/components/ui/Button.tsx (primary/secondary/danger variants)
- [x] T017 [P] Create Input component in frontend/src/components/ui/Input.tsx (with error states)
- [x] T018 [P] Create Modal component in frontend/src/components/ui/Modal.tsx (with backdrop, escape key, click outside)
- [x] T019 [P] Create Toast component in frontend/src/components/ui/Toast.tsx (success/error/info types)
- [x] T020 [P] Create Skeleton component in frontend/src/components/ui/Skeleton.tsx (shimmer animation)
- [x] T021 [P] Create Badge component in frontend/src/components/ui/Badge.tsx (pending/completed colors)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View and Manage Task List (Priority: P1) 🎯 MVP

**Goal**: Core task CRUD operations with optimistic UI updates

**Independent Test**: Load /tasks page, create a new task, toggle completion, edit task, delete task. All actions should work with immediate visual feedback and toast notifications.

### Implementation for User Story 1

- [x] T022 [P] [US1] Create RootLayout in frontend/src/app/layout.tsx (wraps AuthContext, TaskContext, ToastContext)
- [x] T023 [P] [US1] Create Header component in frontend/src/components/layout/Header.tsx (app logo, user avatar, logout button)
- [x] T024 [P] [US1] Create root page redirect logic in frontend/src/app/page.tsx (/ → /login or /tasks based on auth state)
- [x] T025 [P] [US1] Create /tasks page (Server Component) in frontend/src/app/tasks/page.tsx (fetches mock data, passes to TaskList)
- [x] T026 [US1] Create TaskList component in frontend/src/components/tasks/TaskList.tsx (Client Component with useOptimistic)
- [x] T027 [P] [US1] Create TaskCard component in frontend/src/components/tasks/TaskCard.tsx (title, description, status badge, action buttons)
- [x] T028 [P] [US1] Create TaskForm modal in frontend/src/components/tasks/TaskForm.tsx (create/edit modes, validation)
- [x] T029 [P] [US1] Create DeleteConfirm modal in frontend/src/components/tasks/DeleteConfirm.tsx (confirmation dialog)
- [x] T030 [P] [US1] Create EmptyState component in frontend/src/components/tasks/EmptyState.tsx (no tasks illustration, CTA button)
- [x] T031 [US1] Integrate TaskForm with TaskList (create new task action, optimistic update)
- [x] T032 [US1] Integrate TaskCard toggle completion (optimistic status update, badge color change)
- [x] T033 [US1] Integrate TaskForm with TaskCard edit (pre-fill form, optimistic update)
- [x] T034 [US1] Integrate DeleteConfirm with TaskCard (remove from list, optimistic delete, toast notification)
- [x] T035 [US1] Add toast notifications for all CRUD operations (success messages)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - This is the MVP!

---

## Phase 4: User Story 2 - Filter and Sort Tasks (Priority: P2)

**Goal**: Enable users to filter by status and sort by date/title with URL persistence

**Independent Test**: Create multiple tasks with different statuses, click filter buttons (All/Pending/Completed), select sort options (Date/Title), verify URL params persist, share URL to confirm state preservation.

### Implementation for User Story 2

- [x] T036 [P] [US2] Create TaskFilters component in frontend/src/components/tasks/TaskFilters.tsx (All/Pending/Completed buttons with active state)
- [x] T037 [P] [US2] Create TaskSort component in frontend/src/components/tasks/TaskSort.tsx (dropdown for Date/Title sort options)
- [x] T038 [US2] Integrate TaskFilters with TaskList (read/write URL search params with useSearchParams)
- [x] T039 [US2] Integrate TaskSort with TaskList (read/write URL search params, reorder tasks)
- [x] T040 [US2] Implement client-side filtering logic in TaskList (filter by status based on URL param)
- [x] T041 [US2] Implement client-side sorting logic in TaskList (sort by date desc or title asc based on URL param)
- [x] T042 [US2] Add empty filter results state (show "No [status] tasks found" message)

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently

---

## Phase 5: User Story 3 - Authentication UI Flow (Priority: P3)

**Goal**: Production-ready login/signup pages with form validation (mock auth backend)

**Independent Test**: Navigate to /login and /signup, fill out forms, trigger validation errors (empty fields, invalid email, weak password), submit with valid data, verify redirect to /tasks, test logout flow.

### Implementation for User Story 3

- [x] T043 [P] [US3] Create /login page in frontend/src/app/login/page.tsx (centered form layout)
- [x] T044 [P] [US3] Create /signup page in frontend/src/app/signup/page.tsx (centered form layout)
- [x] T045 [P] [US3] Create LoginForm component in frontend/src/components/auth/LoginForm.tsx (email, password fields, validation)
- [x] T046 [P] [US3] Create SignupForm component in frontend/src/components/auth/SignupForm.tsx (name, email, password fields, validation)
- [x] T047 [US3] Implement login form validation logic (required fields, email format)
- [x] T048 [US3] Implement signup form validation logic (required fields, email format, password strength)
- [x] T049 [US3] Add password strength indicator to SignupForm (visual progress bar, text feedback)
- [x] T050 [US3] Connect LoginForm to AuthContext (mock login, set auth state, redirect to /tasks)
- [x] T051 [US3] Connect SignupForm to AuthContext (mock signup, set auth state, redirect to /tasks)
- [x] T052 [US3] Add logout functionality to Header component (clear auth state, redirect to /login)
- [x] T053 [US3] Add loading spinners to login/signup submit buttons

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently

---

## Phase 6: User Story 4 - Responsive Design and Mobile Experience (Priority: P2)

**Goal**: Mobile-first responsive layout with touch-friendly controls

**Independent Test**: Resize browser to mobile (320px, 375px), tablet (768px), desktop (1024px, 1440px) widths. Verify hamburger menu on mobile, bottom-fixed add button, touch targets min 44px, keyboard navigation works.

### Implementation for User Story 4

- [x] T054 [P] [US4] Create MobileNav component in frontend/src/components/layout/MobileNav.tsx (hamburger menu, slide-out drawer)
- [x] T055 [US4] Integrate MobileNav with Header (show hamburger icon < 768px, hide full nav)
- [x] T056 [US4] Add mobile-specific "Add Task" bottom-fixed button to /tasks page (< 768px only)
- [x] T057 [US4] Update Header responsive breakpoints (mobile: stacked, tablet: horizontal, desktop: full nav)
- [x] T058 [US4] Update TaskList responsive layout (mobile: single column, tablet: 2 columns, desktop: max-width container)
- [x] T059 [US4] Update TaskCard touch targets (ensure min 44px height/width for all buttons on mobile)
- [x] T060 [US4] Update Modal responsive styles (full-screen on mobile < 640px, centered on larger screens)
- [x] T061 [US4] Test keyboard navigation (Tab order, Enter to submit, Escape to close modals)
- [x] T062 [US4] Test all breakpoints and verify smooth transitions

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and edge case handling

- [x] T063 [P] Add skeleton loading states to /tasks page (show 3-4 skeleton cards on initial load)
- [x] T064 [P] Implement text truncation for long task titles (ellipsis after 50 chars in list view, full text in modal)
- [x] T065 [P] Implement text truncation for long descriptions (ellipsis after 100 chars in card view, full text in modal)
- [x] T066 [P] Add smooth animations to modals (fade-in backdrop, scale-up content)
- [x] T067 [P] Add smooth animations to task cards (fade-in on create, fade-out on delete)
- [x] T068 [P] Add smooth transitions to status badge (color change on toggle)
- [x] T069 [P] Prevent double-submission on all forms (disable button, show loading spinner during processing)
- [x] T070 [P] Add focus trap to modals (Tab cycles within modal, Shift+Tab goes backwards)
- [x] T071 [P] Add ARIA labels to all icon buttons (edit, delete, close, hamburger menu)
- [x] T072 [P] Verify WCAG AA color contrast for all text and interactive elements
- [x] T073 [P] Test with screen reader (verify toast announcements with aria-live)
- [x] T074 Update globals.css with Tailwind base styles and custom CSS variables
- [x] T075 Add error boundaries for graceful error handling (wrap app in ErrorBoundary component)

**Checkpoint**: All polish and edge cases handled

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - MVP)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2 - Filtering)**: Can start after Foundational (Phase 2) - Independent of US1 but benefits from having tasks to filter
- **User Story 3 (P3 - Auth UI)**: Can start after Foundational (Phase 2) - Independent of US1/US2
- **User Story 4 (P2 - Responsive)**: Can start after Foundational (Phase 2) - Should test with existing components from US1/US2/US3

**Recommended Order**: Phase 1 → Phase 2 → Phase 3 (US1 MVP) → Test → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (US4) → Phase 7 (Polish)

### Within Each User Story

- Base components before composed components
- Context/state management before UI components that use them
- Layout components before page routes
- Forms before integration with parent components
- Actions before optimistic updates

### Parallel Opportunities

- **All Setup tasks** (T001-T005) can run in parallel
- **All Foundational tasks** (T006-T021) can run in parallel within Phase 2
- **Once Foundational phase completes**, all user stories can start in parallel if team capacity allows:
  - Team Member A: User Story 1 (T022-T035)
  - Team Member B: User Story 2 (T036-T042)
  - Team Member C: User Story 3 (T043-T053)
  - Team Member D: User Story 4 (T054-T062)
- **Within User Story 1**: T022-T030 (all [P] tasks) can run in parallel
- **Within User Story 2**: T036-T037 (both [P] tasks) can run in parallel
- **Within User Story 3**: T043-T046 (all [P] tasks) can run in parallel
- **Within User Story 4**: T054 alone is [P] (others depend on existing components)
- **All Polish tasks** (T063-T073) marked [P] can run in parallel

---

## Parallel Example: User Story 1 (MVP)

```bash
# After Foundational phase is complete, launch all base components in parallel:
Task: T022 [P] [US1] Create RootLayout
Task: T023 [P] [US1] Create Header component
Task: T024 [P] [US1] Create root page redirect
Task: T025 [P] [US1] Create /tasks page
Task: T027 [P] [US1] Create TaskCard component
Task: T028 [P] [US1] Create TaskForm modal
Task: T029 [P] [US1] Create DeleteConfirm modal
Task: T030 [P] [US1] Create EmptyState component

# Then sequentially integrate:
Task: T026 [US1] Create TaskList (depends on contexts)
Task: T031 [US1] Integrate TaskForm with TaskList
Task: T032 [US1] Integrate toggle completion
Task: T033 [US1] Integrate edit functionality
Task: T034 [US1] Integrate delete functionality
Task: T035 [US1] Add toast notifications
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T021) - CRITICAL blocking phase
3. Complete Phase 3: User Story 1 (T022-T035) - This is the MVP!
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Create task → verify instant UI update and toast
   - Toggle completion → verify status badge changes
   - Edit task → verify modal pre-fills and updates
   - Delete task → verify confirmation and removal
5. Deploy/demo if MVP ready

### Incremental Delivery

1. Complete Setup + Foundational (T001-T021) → Foundation ready
2. Add User Story 1 (T022-T035) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (T036-T042) → Test independently → Deploy/Demo (Filtering added!)
4. Add User Story 3 (T043-T053) → Test independently → Deploy/Demo (Auth UI complete!)
5. Add User Story 4 (T054-T062) → Test independently → Deploy/Demo (Fully responsive!)
6. Add Polish (T063-T075) → Final testing → Production-ready!

Each story adds value without breaking previous stories.

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T021)
2. Once Foundational is done (checkpoint reached):
   - Developer A: User Story 1 (T022-T035) - MVP priority
   - Developer B: User Story 2 (T036-T042) - Filtering
   - Developer C: User Story 3 (T043-T053) - Auth pages
   - Developer D: User Story 4 (T054-T062) - Responsive design
3. Stories complete and integrate independently
4. Team reconvenes for Phase 7 (Polish) once all stories done

---

## Notes

- [P] tasks = different files, no dependencies - can run in parallel
- [US1/US2/US3/US4] labels = which user story the task belongs to
- Each user story should be independently completable and testable
- No automated tests in this phase (deferred to Phase 5 per constitution)
- Manual UI testing via browser for all acceptance criteria
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Mock data with 50ms delay simulates realistic network behavior
- All patterns follow constitution's Allowed Patterns (Server Actions, useOptimistic, URL params)

---

## Task Summary

**Total Tasks**: 75 tasks

**Task Count by Phase**:
- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 16 tasks
- Phase 3 (User Story 1 - MVP): 14 tasks
- Phase 4 (User Story 2): 7 tasks
- Phase 5 (User Story 3): 11 tasks
- Phase 6 (User Story 4): 9 tasks
- Phase 7 (Polish): 13 tasks

**Parallel Opportunities**: 37 tasks marked with [P] can run in parallel within their phase

**MVP Scope**: Complete Phase 1-3 (T001-T035) = 35 tasks for functional MVP with core task CRUD

**Independent Test Criteria**:
- **US1**: Create, toggle, edit, delete tasks with instant feedback
- **US2**: Filter by status, sort by date/title, URL persistence
- **US3**: Login/signup forms with validation, redirect flow
- **US4**: Responsive layouts at all breakpoints, keyboard navigation

---

## Status

✅ **Complete** - Tasks generated and organized by user story. Ready for implementation via `/sp.implement`.

**Next**: Run `/sp.implement` to execute tasks in dependency order with Claude Code.
