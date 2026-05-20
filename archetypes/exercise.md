+++
title       = '{{ replace .File.ContentBaseName "-" " " | title }}'
description = ''
date        = '{{ .Date }}'
draft       = true
weight      = 10
duration    = '15 min'
difficulty  = 'beginner'
tags        = []
+++

{{</* lead */>}}
What the reader will build in this exercise. State the end-state clearly so
they know when they're done.
{{</* /lead */>}}

{{</* prerequisites */>}}
- Item one
- Item two
{{</* /prerequisites */>}}

## Steps

{{</* step "Set up the workspace" */>}}
Brief instruction for the first step.

```bash
mkdir my-exercise && cd my-exercise
```
{{</* /step */>}}

{{</* step "Run the example" */>}}
Walk through the core action. Show the expected output:

{{</* terminal */>}}
$ ./run.sh
Hello, workshop.
{{</* /terminal */>}}
{{</* /step */>}}

{{</* step "Verify your result" */>}}
What success looks like. If there's a checkpoint criterion the reader can
self-verify against, list it.

{{</* solution */>}}
The expected output / final state, hidden behind a click so readers try
first before peeking.
{{</* /solution */>}}
{{</* /step */>}}

{{</* checkpoint "You've completed the exercise" */>}}
