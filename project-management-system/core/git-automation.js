#!/usr/bin/env node

/**
 * Git Automation System - Intelligent Git Workflows
 * Provides smart git management for different project types
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class GitAutomation {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.config = this.loadProjectConfig();
  }

  loadProjectConfig() {
    const configPath = path.join(this.projectPath, '.cursorrules');
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf8');
      // Extract project type and other metadata
      const projectType = this.extractProjectType(content);
      return { projectType, content };
    }
    return { projectType: 'unknown', content: '' };
  }

  extractProjectType(content) {
    const patterns = {
      'mobile-app': /react.native|expo|mobile/i,
      'web-fullstack': /next\.js|react.*express|full.stack/i,
      'api-backend': /express|fastify|api.*backend/i,
      'data-science': /jupyter|pandas|machine.learning/i,
      'android-reverse': /android.*reverse|apk.*analysis/i,
      'website-seo': /seo|lighthouse|optimization/i,
      'wordpress': /wordpress|php.*cms/i,
      'ecommerce': /e.commerce|stripe|shopping/i,
      'desktop-electron': /electron|desktop/i,
      'devops-infra': /docker|kubernetes|infrastructure/i
    };

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(content)) {
        return type;
      }
    }
    return 'general';
  }

  /**
   * Smart commit message generation based on file changes
   */
  generateCommitMessage(files, type = null) {
    if (type) {
      return this.getCommitMessage(type);
    }

    // Analyze changed files to determine commit type
    const analysis = this.analyzeChanges(files);
    const commitType = this.determineCommitType(analysis);
    const scope = this.determineScope(analysis);
    const description = this.generateDescription(analysis);

    let message = commitType;
    if (scope) message += `(${scope})`;
    message += `: ${description}`;

    return message;
  }

  analyzeChanges(files) {
    const analysis = {
      added: [],
      modified: [],
      deleted: [],
      types: {
        tests: [],
        docs: [],
        config: [],
        components: [],
        api: [],
        styles: [],
        assets: []
      }
    };

    files.forEach(file => {
      // Categorize by change type
      if (file.status === 'A') analysis.added.push(file.path);
      else if (file.status === 'M') analysis.modified.push(file.path);
      else if (file.status === 'D') analysis.deleted.push(file.path);

      // Categorize by file type
      const ext = path.extname(file.path);
      const basename = path.basename(file.path);
      
      if (this.isTestFile(file.path)) analysis.types.tests.push(file.path);
      else if (this.isDocFile(file.path)) analysis.types.docs.push(file.path);
      else if (this.isConfigFile(file.path)) analysis.types.config.push(file.path);
      else if (this.isComponentFile(file.path)) analysis.types.components.push(file.path);
      else if (this.isApiFile(file.path)) analysis.types.api.push(file.path);
      else if (this.isStyleFile(file.path)) analysis.types.styles.push(file.path);
      else if (this.isAssetFile(file.path)) analysis.types.assets.push(file.path);
    });

    return analysis;
  }

  determineCommitType(analysis) {
    // Priority order for commit types
    if (analysis.types.tests.length > 0) return 'test';
    if (analysis.types.docs.length > 0 && analysis.types.docs.length === analysis.added.length + analysis.modified.length) return 'docs';
    if (analysis.types.config.length > 0 && analysis.types.config.length === analysis.added.length + analysis.modified.length) return 'chore';
    if (analysis.deleted.length > analysis.added.length) return 'refactor';
    if (analysis.added.length > analysis.modified.length) return 'feat';
    return 'fix';
  }

  determineScope(analysis) {
    const scopes = {
      'mobile-app': ['auth', 'ui', 'navigation', 'api', 'storage'],
      'web-fullstack': ['frontend', 'backend', 'api', 'database', 'auth'],
      'api-backend': ['routes', 'controllers', 'models', 'middleware', 'database'],
      'data-science': ['analysis', 'models', 'visualization', 'data', 'pipeline'],
      'website-seo': ['seo', 'performance', 'analytics', 'optimization'],
      'general': ['core', 'utils', 'config', 'docs', 'tests']
    };

    const projectScopes = scopes[this.config.projectType] || scopes.general;
    
    // Find most relevant scope based on file paths
    for (const scope of projectScopes) {
      const relevantFiles = analysis.added.concat(analysis.modified).filter(file =>
        file.toLowerCase().includes(scope) || 
        path.dirname(file).toLowerCase().includes(scope)
      );
      if (relevantFiles.length > 0) {
        return scope;
      }
    }

    return null;
  }

  generateDescription(analysis) {
    const totalChanges = analysis.added.length + analysis.modified.length + analysis.deleted.length;
    
    if (analysis.added.length > 0 && analysis.modified.length === 0) {
      return `add ${this.getFileTypeDescription(analysis.added)}`;
    }
    
    if (analysis.modified.length > 0 && analysis.added.length === 0) {
      return `update ${this.getFileTypeDescription(analysis.modified)}`;
    }
    
    if (analysis.deleted.length > 0) {
      return `remove ${this.getFileTypeDescription(analysis.deleted)}`;
    }

    if (totalChanges === 1) {
      const file = [...analysis.added, ...analysis.modified][0];
      return `update ${path.basename(file)}`;
    }

    return `update ${totalChanges} files`;
  }

  getFileTypeDescription(files) {
    const types = files.map(file => {
      if (this.isComponentFile(file)) return 'components';
      if (this.isApiFile(file)) return 'API endpoints';
      if (this.isTestFile(file)) return 'tests';
      if (this.isDocFile(file)) return 'documentation';
      if (this.isStyleFile(file)) return 'styles';
      return 'files';
    });

    const uniqueTypes = [...new Set(types)];
    return uniqueTypes.length === 1 ? uniqueTypes[0] : 'multiple files';
  }

  /**
   * Intelligent branching strategies
   */
  createBranch(purpose, description) {
    const strategies = {
      'feature': 'feat/',
      'bug': 'fix/',
      'hotfix': 'hotfix/',
      'experiment': 'experiment/',
      'docs': 'docs/',
      'refactor': 'refactor/'
    };

    const prefix = strategies[purpose] || 'feat/';
    const branchName = prefix + this.sanitizeBranchName(description);
    
    try {
      execSync(`git checkout -b ${branchName}`, { stdio: 'pipe' });
      console.log(`✅ Created branch: ${branchName}`);
      return branchName;
    } catch (error) {
      throw new Error(`Failed to create branch: ${error.message}`);
    }
  }

  sanitizeBranchName(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 50);
  }

  /**
   * Automated release management
   */
  prepareRelease(version, type = 'minor') {
    const releaseBranch = `release/${version}`;
    
    try {
      // Create release branch
      execSync(`git checkout -b ${releaseBranch}`, { stdio: 'pipe' });
      
      // Update version in package.json if exists
      const packagePath = path.join(this.projectPath, 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        packageJson.version = version;
        fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
        
        execSync('git add package.json', { stdio: 'pipe' });
        execSync(`git commit -m "chore: bump version to ${version}"`, { stdio: 'pipe' });
      }
      
      console.log(`✅ Release branch ${releaseBranch} prepared`);
      console.log('📋 Next steps:');
      console.log('1. Test the release candidate');
      console.log('2. Merge to main branch');
      console.log('3. Tag the release');
      console.log('4. Deploy to production');
      
    } catch (error) {
      throw new Error(`Failed to prepare release: ${error.message}`);
    }
  }

  /**
   * Memory bank integration
   */
  updateMemoryBank(changes) {
    const memoryBankPath = path.join(this.projectPath, 'memory-bank');
    if (!fs.existsSync(memoryBankPath)) return;

    const activeContextPath = path.join(memoryBankPath, 'activeContext.md');
    if (fs.existsSync(activeContextPath)) {
      let content = fs.readFileSync(activeContextPath, 'utf8');
      
      // Update recent changes section
      const changeEntry = `- ✅ ${changes}`;
      const date = new Date().toISOString().split('T')[0];
      
      if (content.includes('## Recent Changes')) {
        content = content.replace(
          /## Recent Changes\n(.*?)\n\n/s,
          `## Recent Changes\n${changeEntry}\n$1\n\n`
        );
      }
      
      // Update last modified date
      content = content.replace(/\*Last Updated: .*?\*/, `*Last Updated: ${date}*`);
      
      fs.writeFileSync(activeContextPath, content);
      console.log('📝 Memory bank updated');
    }
  }

  // File type detection helpers
  isTestFile(path) {
    return /\.(test|spec)\.(js|ts|jsx|tsx)$/.test(path) || /\/tests?\//.test(path);
  }

  isDocFile(path) {
    return /\.(md|txt|rst)$/.test(path) || /\/docs?\//.test(path) || /README/.test(path);
  }

  isConfigFile(path) {
    const configFiles = /\.(json|yaml|yml|toml|ini)$|package\.json|tsconfig|eslint|prettier|babel|webpack/;
    return configFiles.test(path);
  }

  isComponentFile(path) {
    return /\/(components?|ui)\/.*\.(jsx?|tsx?)$/.test(path);
  }

  isApiFile(path) {
    return /\/(api|routes?|controllers?)\/.*\.(js|ts)$/.test(path);
  }

  isStyleFile(path) {
    return /\.(css|scss|sass|less|styl)$/.test(path);
  }

  isAssetFile(path) {
    return /\.(png|jpe?g|gif|svg|ico|woff2?|ttf|eot)$/.test(path);
  }

  getCommitMessage(type) {
    const messages = {
      'initial': 'feat: initial project setup',
      'wip': 'wip: work in progress',
      'save': 'chore: save current progress',
      'cleanup': 'chore: code cleanup and formatting',
      'merge': 'merge: resolve conflicts and merge changes'
    };
    return messages[type] || 'chore: update project files';
  }
}

// CLI Interface
async function main() {
  const automation = new GitAutomation();
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'commit':
      const message = args[1] || automation.generateCommitMessage([]);
      try {
        execSync('git add .', { stdio: 'pipe' });
        execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
        automation.updateMemoryBank(message);
      } catch (error) {
        console.error('❌ Commit failed:', error.message);
      }
      break;

    case 'branch':
      const purpose = args[1];
      const description = args.slice(2).join(' ');
      if (!purpose || !description) {
        console.error('Usage: git-automation branch <purpose> <description>');
        return;
      }
      try {
        automation.createBranch(purpose, description);
      } catch (error) {
        console.error('❌ Branch creation failed:', error.message);
      }
      break;

    case 'release':
      const version = args[1];
      if (!version) {
        console.error('Usage: git-automation release <version>');
        return;
      }
      try {
        automation.prepareRelease(version);
      } catch (error) {
        console.error('❌ Release preparation failed:', error.message);
      }
      break;

    default:
      console.log('🤖 Git Automation System\n');
      console.log('Commands:');
      console.log('  commit [message]     - Smart commit with generated message');
      console.log('  branch <purpose> <description> - Create branch with naming convention');
      console.log('  release <version>    - Prepare release branch');
      console.log('\nExample:');
      console.log('  node git-automation.js branch feature "user authentication"');
      console.log('  node git-automation.js commit "fix user login validation"');
      console.log('  node git-automation.js release "1.2.0"');
  }
}

if (require.main === module) {
  main();
}

module.exports = GitAutomation;
