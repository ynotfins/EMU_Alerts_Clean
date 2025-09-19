# Project Management System Setup Script
# Run this to set up the comprehensive project management system

Write-Host "🚀 Setting up Comprehensive Project Management System..." -ForegroundColor Blue

# Check prerequisites
Write-Host "`n📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is required but not installed" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check Git
try {
    $gitVersion = git --version
    Write-Host "✅ Git: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is required but not installed" -ForegroundColor Red
    Write-Host "Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Make scripts executable
Write-Host "`n🔧 Making scripts executable..." -ForegroundColor Yellow
$scriptPath = $PSScriptRoot

# Create convenient command aliases
Write-Host "`n📝 Creating command aliases..." -ForegroundColor Yellow

$createProjectScript = @"
#!/usr/bin/env node
const path = require('path');
const TemplateGenerator = require(path.join(__dirname, 'core', 'template-generator.js'));
const generator = new TemplateGenerator();

async function main() {
    const args = process.argv.slice(2);
    if (args.length < 2) {
        console.log('Usage: create-project <template-id> <project-name> [options]');
        console.log('Example: create-project 01-mobile-app my-awesome-app --industry Healthcare');
        generator.listTemplates();
        return;
    }
    
    const templateId = args[0];
    const projectName = args[1];
    const options = {};
    
    for (let i = 2; i < args.length; i += 2) {
        const key = args[i].replace('--', '');
        const value = args[i + 1];
        if (value) {
            options[key] = value;
        }
    }
    
    try {
        await generator.createProject(templateId, projectName, options);
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

main();
"@

$gitAutomationScript = @"
#!/usr/bin/env node
const GitAutomation = require('./core/git-automation.js');
const automation = new GitAutomation();

const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
    case 'smart-commit':
        // Smart commit with auto-generated message
        const { execSync } = require('child_process');
        try {
            execSync('git add .', { stdio: 'pipe' });
            const message = automation.generateCommitMessage([]);
            execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
            automation.updateMemoryBank(message);
        } catch (error) {
            console.error('❌ Commit failed:', error.message);
        }
        break;
    
    case 'new-feature':
        const featureName = args.join(' ');
        if (!featureName) {
            console.error('Usage: git-smart new-feature <feature description>');
            return;
        }
        try {
            automation.createBranch('feature', featureName);
        } catch (error) {
            console.error('❌ Failed to create feature branch:', error.message);
        }
        break;
    
    default:
        console.log('🤖 Git Smart Commands:');
        console.log('  smart-commit         - Commit with auto-generated message');
        console.log('  new-feature <name>   - Create feature branch');
        console.log('');
        console.log('Examples:');
        console.log('  git-smart smart-commit');
        console.log('  git-smart new-feature "user authentication system"');
}
"@

# Write the scripts
$createProjectScript | Out-File -FilePath "$scriptPath\create-project.js" -Encoding UTF8
$gitAutomationScript | Out-File -FilePath "$scriptPath\git-smart.js" -Encoding UTF8

# Create PowerShell wrapper scripts
$psWrapper = @"
#!/usr/bin/env pwsh
node "`$PSScriptRoot\create-project.js" `$args
"@

$psWrapper | Out-File -FilePath "$scriptPath\create-project.ps1" -Encoding UTF8

$gitWrapper = @"
#!/usr/bin/env pwsh
node "`$PSScriptRoot\git-smart.js" `$args
"@

$gitWrapper | Out-File -FilePath "$scriptPath\git-smart.ps1" -Encoding UTF8

Write-Host "✅ Command scripts created" -ForegroundColor Green

# Install any required Node.js dependencies
Write-Host "`n📦 Installing Node.js dependencies..." -ForegroundColor Yellow
try {
    Set-Location $scriptPath
    if (Test-Path "package.json") {
        npm install
    } else {
        # Create a minimal package.json for this system
        $packageJson = @{
            name = "project-management-system"
            version = "1.0.0"
            description = "Comprehensive project management system with templates and automation"
            scripts = @{
                "create-project" = "node create-project.js"
                "git-smart" = "node git-smart.js"
                "list-templates" = "node core/template-generator.js list"
            }
            dependencies = @{}
        }
        $packageJson | ConvertTo-Json -Depth 3 | Out-File -FilePath "package.json" -Encoding UTF8
        Write-Host "✅ Created package.json" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️ Warning: Could not set up Node.js dependencies" -ForegroundColor Yellow
}

# Create global shortcuts (optional)
Write-Host "`n🌐 Setting up global commands..." -ForegroundColor Yellow
$userProfile = $PROFILE
$profileDir = Split-Path $userProfile
if (-not (Test-Path $profileDir)) {
    New-Item -ItemType Directory -Path $profileDir -Force
}

$globalFunctions = @"

# Project Management System Functions
function Create-Project {
    param(
        [string]`$Template,
        [string]`$Name,
        [string]`$Industry = "",
        [string]`$Author = ""
    )
    
    `$scriptPath = "$scriptPath"
    `$args = @(`$Template, `$Name)
    
    if (`$Industry) { `$args += "--industry"; `$args += `$Industry }
    if (`$Author) { `$args += "--author-name"; `$args += `$Author }
    
    & node "`$scriptPath\create-project.js" `$args
}

function Git-Smart {
    param([string]`$Command, [string]`$Description = "")
    
    `$scriptPath = "$scriptPath"
    if (`$Description) {
        & node "`$scriptPath\git-smart.js" `$Command `$Description
    } else {
        & node "`$scriptPath\git-smart.js" `$Command
    }
}

function List-Templates {
    `$scriptPath = "$scriptPath"
    & node "`$scriptPath\core\template-generator.js" list
}

# Aliases for convenience
Set-Alias -Name cproject -Value Create-Project
Set-Alias -Name gitsmart -Value Git-Smart
Set-Alias -Name templates -Value List-Templates

"@

# Add functions to PowerShell profile
if (Test-Path $userProfile) {
    $currentProfile = Get-Content $userProfile -Raw
    if ($currentProfile -notlike "*Project Management System Functions*") {
        $globalFunctions | Add-Content $userProfile
        Write-Host "✅ Added global functions to PowerShell profile" -ForegroundColor Green
    }
} else {
    $globalFunctions | Out-File -FilePath $userProfile -Encoding UTF8
    Write-Host "✅ Created PowerShell profile with global functions" -ForegroundColor Green
}

Write-Host "`n✨ Setup Complete! " -ForegroundColor Green
Write-Host "`nProject Management System is ready to use." -ForegroundColor White

Write-Host "`n📚 Available Commands:" -ForegroundColor Cyan
Write-Host "  .\create-project.ps1 <template> <name>  - Create new project" -ForegroundColor White
Write-Host "  .\git-smart.ps1 smart-commit           - Smart git commit" -ForegroundColor White
Write-Host "  .\git-smart.ps1 new-feature <desc>    - Create feature branch" -ForegroundColor White

Write-Host "`n🌟 Global Functions (restart PowerShell to use):" -ForegroundColor Cyan
Write-Host "  Create-Project <template> <name>       - Create new project" -ForegroundColor White
Write-Host "  Git-Smart smart-commit                 - Smart git commit" -ForegroundColor White
Write-Host "  List-Templates                         - Show all templates" -ForegroundColor White

Write-Host "`n🎯 Quick Start:" -ForegroundColor Yellow
Write-Host "  1. List available templates: .\create-project.ps1" -ForegroundColor White
Write-Host "  2. Create a project: .\create-project.ps1 01-mobile-app my-app" -ForegroundColor White
Write-Host "  3. Use smart git: .\git-smart.ps1 smart-commit" -ForegroundColor White

Write-Host "`n🔗 More Info:" -ForegroundColor Yellow
Write-Host "  - Templates: 10 comprehensive project types" -ForegroundColor White
Write-Host "  - Memory Bank: Automatic documentation system" -ForegroundColor White
Write-Host "  - Git Automation: Intelligent commit messages and branching" -ForegroundColor White
Write-Host "  - Cursor Integration: Seamless IDE integration" -ForegroundColor White

Write-Host "`nHappy coding! 🚀" -ForegroundColor Blue
