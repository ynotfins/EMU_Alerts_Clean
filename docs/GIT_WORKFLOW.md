# Git Workflow

## Branching

- **main**: protected, release-ready
- **feature/***: active feature work
- **hotfix/***: urgent fixes

## Tags

Tag milestones (e.g., `v1.2.0-pre-crm`, `v1.3.0-esign`)

## Typical Cycle

1. `git checkout -b feature/<name>`
2. Develop with small, focused commits
3. `git push -u origin feature/<name>`
4. PR → review → squash & merge
5. Tag releases

## Useful Commands
```bash
git add -A
git commit -m "feat: ..."
git push
git tag -a vX.Y.Z -m "release notes"
git push origin vX.Y.Z
```
