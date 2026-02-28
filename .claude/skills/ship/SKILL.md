---
name: ship
description: Stage all changes, commit, push to GitHub, and deploy to Firebase
disable-model-invocation: true
user-invocable: true
allowed-tools: Bash(git *)
argument-hint: [optional message]
---

Ship all changes to GitHub which auto-deploys to Firebase Hosting.

Follow these steps:

1. Run `git status` and `git diff` to see what changed
2. Stage all changed files with `git add` (add specific files, not `-A`)
3. Write a short, friendly commit message summarizing the changes. If the user provided a message via `$ARGUMENTS`, use that instead
4. Commit (end the message with `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`)
5. Push to `origin main`
6. Tell the user their changes are deploying to **https://apple-catchers.web.app** and will be live in about a minute
