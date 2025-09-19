#!/usr/bin/env node

/**
 * Template Generator - Automated Project Creation System
 * Creates new projects from predefined templates with customization
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

class TemplateGenerator {
  constructor() {
    this.templatesDir = path.join(__dirname, '..', 'templates');
    this.availableTemplates = this.getAvailableTemplates();
  }

  getAvailableTemplates() {
    const templates = {};
    const templateDirs = fs.readdirSync(this.templatesDir);
    
    for (const dir of templateDirs) {
      const configPath = path.join(this.templatesDir, dir, 'template-config.json');
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        templates[dir] = config;
      }
    }
    
    return templates;
  }

  listTemplates() {
    console.log('\n🚀 Available Project Templates:\n');
    
    Object.entries(this.availableTemplates).forEach(([id, config]) => {
      console.log(`${id.padEnd(20)} ${config.name}`);
      console.log(`${' '.repeat(20)} ${config.description}`);
      console.log(`${' '.repeat(20)} Tags: ${config.tags.join(', ')}`);
      console.log(`${' '.repeat(20)} Difficulty: ${config.difficulty} | Setup: ${config.estimatedSetupTime}`);
      console.log();
    });
  }

  async createProject(templateId, projectName, options = {}) {
    const template = this.availableTemplates[templateId];
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    console.log(`\n📦 Creating ${template.name} project: ${projectName}\n`);

    // Create project directory
    const projectDir = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectDir)) {
      throw new Error(`Directory ${projectName} already exists`);
    }
    
    fs.mkdirSync(projectDir, { recursive: true });

    // Copy template files
    await this.copyTemplateFiles(templateId, projectDir, projectName, options);

    // Initialize git repository
    await this.initializeGit(projectDir, template.gitConfig);

    // Run setup steps
    await this.runSetupSteps(projectDir, template.setupSteps, options);

    // Initialize memory bank
    await this.initializeMemoryBank(projectDir, template.memoryBankTemplate, projectName, options);

    // Create .cursorrules file
    await this.createCursorRules(projectDir, template, projectName, options);

    console.log(`\n✅ Project ${projectName} created successfully!`);
    console.log(`📁 Location: ${projectDir}`);
    console.log(`🚀 Get started:`);
    console.log(`   cd ${projectName}`);
    
    if (template.setupSteps && template.setupSteps.length > 0) {
      console.log(`   # Follow remaining setup steps in memory-bank/setup-guide.md`);
    }
  }

  async copyTemplateFiles(templateId, projectDir, projectName, options) {
    const templateDir = path.join(this.templatesDir, templateId);
    const files = this.getAllFiles(templateDir);

    for (const file of files) {
      // Skip config file and memory-bank template files
      if (file.includes('template-config.json') || file.includes('memory-bank-template')) {
        continue;
      }

      const relativePath = path.relative(templateDir, file);
      const targetPath = path.join(projectDir, relativePath);
      
      // Create directory if needed
      const targetDir = path.dirname(targetPath);
      fs.mkdirSync(targetDir, { recursive: true });

      // Read, process variables, and write file
      let content = fs.readFileSync(file, 'utf8');
      content = this.processVariables(content, projectName, options);
      
      fs.writeFileSync(targetPath, content);
    }
  }

  processVariables(content, projectName, options) {
    const variables = {
      '{{projectName}}': projectName,
      '{{displayName}}': options.displayName || this.toTitleCase(projectName),
      '{{currentDate}}': new Date().toISOString().split('T')[0],
      '{{authorName}}': options.authorName || 'Your Name',
      '{{industry}}': options.industry || 'Technology',
      '{{primaryColor}}': options.primaryColor || '#007AFF',
      ...options.customVariables
    };

    let processedContent = content;
    Object.entries(variables).forEach(([placeholder, value]) => {
      processedContent = processedContent.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value);
    });

    return processedContent;
  }

  async initializeGit(projectDir, gitConfig) {
    const originalCwd = process.cwd();
    process.chdir(projectDir);

    try {
      execSync('git init', { stdio: 'pipe' });
      execSync(`git checkout -b ${gitConfig.initialBranch || 'main'}`, { stdio: 'pipe' });
      
      // Create .gitignore
      const gitignoreContent = (gitConfig.ignorePatterns || []).join('\n');
      fs.writeFileSync('.gitignore', gitignoreContent);

      // Setup git hooks if specified
      if (gitConfig.hooks) {
        const hooksDir = '.git/hooks';
        Object.entries(gitConfig.hooks).forEach(([hook, command]) => {
          const hookFile = path.join(hooksDir, hook);
          fs.writeFileSync(hookFile, `#!/bin/sh\n${command}\n`);
          fs.chmodSync(hookFile, 0o755);
        });
      }

      execSync('git add .', { stdio: 'pipe' });
      execSync('git commit -m "feat: initial project setup from template"', { stdio: 'pipe' });
      
      console.log('✅ Git repository initialized');
    } finally {
      process.chdir(originalCwd);
    }
  }

  async runSetupSteps(projectDir, setupSteps, options) {
    if (!setupSteps || setupSteps.length === 0) return;

    console.log('\n📋 Running setup steps...\n');
    const originalCwd = process.cwd();
    process.chdir(projectDir);

    try {
      for (const step of setupSteps) {
        console.log(`Step ${step.step}: ${step.title}`);
        
        if (step.commands) {
          for (const command of step.commands) {
            const processedCommand = this.processVariables(command, path.basename(projectDir), options);
            console.log(`  $ ${processedCommand}`);
            
            try {
              execSync(processedCommand, { stdio: 'inherit' });
            } catch (error) {
              console.log(`  ⚠️ Command failed (you may need to run this manually): ${processedCommand}`);
            }
          }
        }

        if (step.manual) {
          console.log('  📋 Manual steps required:');
          step.manual.forEach(task => console.log(`    - ${task}`));
        }
        
        console.log();
      }
    } finally {
      process.chdir(originalCwd);
    }
  }

  async initializeMemoryBank(projectDir, memoryBankTemplate, projectName, options) {
    const memoryBankDir = path.join(projectDir, 'memory-bank');
    fs.mkdirSync(memoryBankDir, { recursive: true });

    // Create core memory bank files
    const coreFiles = {
      'projectbrief.md': memoryBankTemplate['projectbrief.md'] || 'Project brief template',
      'productContext.md': memoryBankTemplate['productContext.md'] || 'Product context template',
      'activeContext.md': `# Active Context: ${projectName}\n\n## Current Work Focus\n**Phase**: Initial Project Setup\n**Status**: Template-based initialization complete\n\n## Recent Changes\n- ✅ Project created from template\n- ✅ Git repository initialized\n- ✅ Memory bank established\n\n## Next Steps\n1. Complete any remaining setup steps\n2. Customize project for specific requirements\n3. Begin core development\n\n*Last Updated: ${new Date().toISOString().split('T')[0]}*`,
      'techContext.md': memoryBankTemplate['techContext.md'] || 'Technical context template',
      'systemPatterns.md': memoryBankTemplate['systemPatterns.md'] || 'System patterns template',
      'progress.md': `# Progress: ${projectName}\n\n## Current Status\n**Phase**: Initial Setup\n**Overall Progress**: 5% (Template initialization complete)\n\n## What Works ✅\n- ✅ Project structure created\n- ✅ Git repository initialized\n- ✅ Memory bank established\n\n## What's Left to Build 🚧\n- ⏳ Core application features\n- ⏳ Testing framework\n- ⏳ Documentation\n- ⏳ Deployment pipeline\n\n*Last Updated: ${new Date().toISOString().split('T')[0]}*`
    };

    Object.entries(coreFiles).forEach(([filename, content]) => {
      const processedContent = this.processVariables(content, projectName, options);
      fs.writeFileSync(path.join(memoryBankDir, filename), processedContent);
    });

    console.log('✅ Memory bank initialized');
  }

  async createCursorRules(projectDir, template, projectName, options) {
    const cursorRules = `# ${template.name} - Project Intelligence

## Project Overview
This is a ${template.category} project created from the ${template.name} template.
**Technology Stack**: ${template.tags.join(', ')}

## Project-Specific Patterns
### Architecture
${JSON.stringify(template.techStack, null, 2)}

### Key Features
${template.features.core ? template.features.core.map(f => `- ${f}`).join('\n') : '- To be defined'}

### Development Workflow
- **Package Manager**: ${template.techStack.development?.packageManager || 'npm'}
- **Testing**: ${template.techStack.development?.testing || 'Jest'}
- **Linting**: ${template.techStack.development?.linting || 'ESLint'}

### Template Information
- **Template Version**: ${template.version}
- **Difficulty**: ${template.difficulty}
- **Estimated Setup Time**: ${template.estimatedSetupTime}

### Customization Applied
${Object.entries(options).map(([key, value]) => `- ${key}: ${value}`).join('\n') || '- Default settings applied'}

## Development Notes
This project follows the global memory bank patterns. Always:
1. Read ALL memory bank files at session start
2. Update activeContext.md with session focus
3. Update progress.md after significant changes
4. Document patterns and decisions in this file

*Generated on ${new Date().toISOString().split('T')[0]} from template ${template.name}*`;

    fs.writeFileSync(path.join(projectDir, '.cursorrules'), cursorRules);
    console.log('✅ .cursorrules file created');
  }

  getAllFiles(dir, files = []) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      if (fs.statSync(fullPath).isDirectory()) {
        this.getAllFiles(fullPath, files);
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  toTitleCase(str) {
    return str.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}

// CLI Interface
async function main() {
  const generator = new TemplateGenerator();
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log('\n🛠️  Project Template Generator\n');
    console.log('Usage:');
    console.log('  node template-generator.js list');
    console.log('  node template-generator.js create <template-id> <project-name> [options]');
    console.log('\nOptions:');
    console.log('  --author-name "Your Name"');
    console.log('  --industry "Technology"');
    console.log('  --primary-color "#007AFF"');
    console.log('\nExample:');
    console.log('  node template-generator.js create 01-mobile-app my-awesome-app --industry "Healthcare"');
    return;
  }

  if (args[0] === 'list') {
    generator.listTemplates();
    return;
  }

  if (args[0] === 'create') {
    const templateId = args[1];
    const projectName = args[2];
    
    if (!templateId || !projectName) {
      console.error('❌ Template ID and project name are required');
      return;
    }

    // Parse options
    const options = {};
    for (let i = 3; i < args.length; i += 2) {
      const key = args[i].replace('--', '').replace('-', '_');
      const value = args[i + 1];
      if (value) {
        options[key] = value;
      }
    }

    try {
      await generator.createProject(templateId, projectName, options);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
}

if (require.main === module) {
  main();
}

module.exports = TemplateGenerator;
