+++
title  = "SPL Cheat Sheet"
hidden = true
+++

# SPL Cheat Sheet

A short reference of the most-used SPL commands. Embedded into other pages via the `include` shortcode.

| Command | Purpose | Example |
| --- | --- | --- |
| `search` | Filter events | `search status=500` |
| `stats` | Aggregate | `stats count by host` |
| `eval` | Compute fields | `eval is_error = if(status>=500, 1, 0)` |
| `where` | Post-filter | `where count > 10` |
| `sort` | Reorder | `sort -count` |
| `head` | Top N | `head 20` |

Combine them with the pipe (`|`) — left to right, output of one is the input of the next.
