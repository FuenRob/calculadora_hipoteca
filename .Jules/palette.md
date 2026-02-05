## 2026-02-05 - Accessibility in Financial Input Islands
**Learning:** The project uses independent React "islands" for forms (e.g., MortgageCalculator) where standard label/input association was missed in favor of visual layout.
**Action:** When working on Astro islands with React, explicitly check for `htmlFor`/`id` bindings as they are often overlooked in component-based isolation.
