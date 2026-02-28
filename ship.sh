#!/bin/bash
# 🍎 Apple Catchers - Ship it!
# Pushes all your changes to GitHub and deploys to Firebase

echo ""
echo "🍎 Apple Catchers - Shipping your changes!"
echo "==========================================="
echo ""

# Stage everything
git add -A

# Check if there's anything to commit
if git diff --cached --quiet; then
  echo "😅 No changes to ship! Make some changes first."
  exit 0
fi

# Show what's being shipped
echo "📦 Changes being shipped:"
git diff --cached --stat
echo ""

# Commit with a message
MSG="${1:-Update Apple Catchers}"
git commit -m "$MSG"
echo ""

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push

echo ""
echo "✅ Done! Your changes are being deployed to:"
echo "   👉 https://apple-catchers.web.app"
echo ""
echo "⏳ Give it about 1 minute for the new version to go live!"
echo ""
