+++
title       = "Archetype examples"
description = "One live page per archetype the theme ships, so you can see what `hugo new --kind X` actually produces."
weight      = 25
layout      = "chapter"
subtitle    = "Authoring · Reference"
tagline     = "Templates → pages"
+++

The five pages below are each generated from one of the theme's archetypes. The section index page you're reading right now uses `chapter` — the same archetype you'd run `hugo new --kind chapter content/foo/_index.md` to create — which is what gives this page its gradient weight number in the corner and the eyebrow subtitle above the title.

Click into any of the four child pages to see the other archetypes rendered as real, navigable pages:

- **`default`** — minimum-viable markdown, no workshop scaffolding.
- **`workshop`** — front-matter conventions for a workshop page; lightweight body.
- **`lesson`** — richer scaffold with lead, objectives, concept, walkthrough, wrap-up.
- **`exercise`** — hands-on lab with steps, terminals, and a hidden solution. `nopager` is set so it sits outside the linear flow.

Each page's source is exactly what `hugo new --kind <name>` produces, with the body fleshed out enough to be a real demo rather than a stub.

If you're authoring your own workshop, run the matching `hugo new --kind …` command and edit from there — the archetypes are starting points, not constraints.
