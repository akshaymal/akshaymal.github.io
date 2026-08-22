#!/usr/bin/env bash
set -euo pipefail

# One-time setup. Requires `gh auth login` first (see docs/WORKFLOW.md).

declare -A LABELS=(
  ["type:feature"]="0E8A16"
  ["type:content"]="1D76DB"
  ["type:chore"]="C5DEF5"
  ["type:bug"]="D93F0B"
  ["priority:p1"]="B60205"
  ["priority:p2"]="D93F0B"
  ["priority:p3"]="FBCA04"
  ["area:content"]="5319E7"
  ["area:ui"]="0052CC"
  ["area:seo"]="006B75"
  ["area:infra"]="795548"
  ["area:harness"]="333333"
  ["agent-ready"]="0E8A16"
)

for name in "${!LABELS[@]}"; do
  color="${LABELS[$name]}"
  gh label create "$name" --color "$color" --force
done

echo "Labels created/updated."
