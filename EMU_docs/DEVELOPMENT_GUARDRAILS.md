# Development Guardrails - EMU Alerts

## 🛡️ Implemented Protection Measures

### **Git Configuration (Windows)**
```bash
git config --global core.longpaths true      # Handle Windows long path issues
git config --global core.autocrlf true      # Automatic CRLF handling
git config --global pull.rebase false       # Use merge strategy for pulls
```

### **Pre-commit & Pre-push Hooks**
Automatically run quality checks before code commits and pushes:

**Pre-commit**: `npm run precommit`
- Runs TypeScript type checking
- Prevents commits with type errors

**Pre-push**: `npm run prepush`  
- Runs TypeScript type checking
- Runs Expo doctor health checks
- Prevents pushes with configuration issues

### **Package.json Scripts**
```json
{
  "scripts": {
    "check": "npm run typecheck",
    "precommit": "npm run typecheck", 
    "prepush": "npm run typecheck && npx expo-doctor || exit 1"
  }
}
```

### **Repository Hygiene**

**Line Ending Normalization (.gitattributes)**
- All text files normalized to LF endings
- Binary files properly marked
- Configuration files standardized

**Hook Management (simple-git-hooks)**
- Lightweight git hooks without complex setup
- Automatic installation via `npx simple-git-hooks`
- Configuration stored in package.json

### **TypeScript Configuration**
- Main project: Strict TypeScript checking
- Functions excluded: Separate TypeScript config in `functions/tsconfig.json`
- Type safety enforced at commit time

### **Expo SDK 54 Compatibility**
- **Babel**: No deprecated `expo-router/babel`, proper `react-native-worklets/plugin`
- **Dependencies**: Expo-pinned versions via `npx expo install`
- **Icons**: Correct asset paths validated
- **Notifications**: Proper trigger format for SDK 54

## 🚨 **Branch Protection Rules**

### **Recommended GitHub Settings**
1. **Require pull request reviews** before merging
2. **Require status checks** to pass before merging
3. **Dismiss stale PR reviews** when new commits are pushed
4. **Require conversation resolution** before merging
5. **Restrict pushes** that create/delete branches
6. **Do not allow bypassing** the above restrictions

### **Status Checks to Require**
- TypeScript compilation (`npm run typecheck`)
- Expo health check (`npx expo-doctor`)
- Successful build/bundle

## 🔧 **Usage**

### **Daily Development**
```bash
# Normal workflow - hooks automatically run
git add .
git commit -m "feat: add new feature"  # Runs precommit hook
git push                               # Runs prepush hook
```

### **Manual Quality Checks**
```bash
npm run check     # TypeScript + ESLint
npm run typecheck # TypeScript only
npm run doctor    # Expo health check
```

### **Dependency Management**
```bash
# Always use Expo for new packages
npx expo install <package-name>

# For dev dependencies or conflicts
npm i -D <package> --legacy-peer-deps
```

### **Emergency Override**
If hooks block urgent fixes:
```bash
git commit --no-verify -m "hotfix: urgent fix"
git push --no-verify
```

## 🎯 **Benefits**

- **Prevents TypeScript errors** from entering repository
- **Catches configuration issues** before deployment
- **Ensures Expo compatibility** at all times
- **Standardizes line endings** across platforms
- **Maintains clean git history** with quality gates
- **Reduces debugging time** by catching issues early

## 📋 **Maintenance**

### **Regular Tasks**
- Review and update dependencies monthly
- Run `npx expo-doctor` periodically
- Monitor and address security vulnerabilities
- Update ESLint rules as project evolves

### **When Adding Dependencies**
1. Use `npx expo install <package>` first
2. If conflicts, use `npm i --legacy-peer-deps`  
3. Test with `npm run check`
4. Commit only after passing all checks

*Development Guardrails - Protecting EMU Alerts code quality*
