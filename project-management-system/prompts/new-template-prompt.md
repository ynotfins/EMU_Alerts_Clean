# New Template Creation Prompt

Use this comprehensive prompt to create new project templates for the management system.

## Template Analysis Prompt

```
I need to create a new project template for the comprehensive project management system. Please analyze the following technology stack and create a complete template configuration.

## Technology Stack to Analyze:
[SPECIFY THE STACK - Example: "Vue.js 3 + Nuxt 3 + Supabase + Tailwind CSS"]

## Project Type:
[SPECIFY TYPE - Example: "E-commerce storefront", "SaaS dashboard", "Portfolio website"]

## Requirements:
Please create a comprehensive template that includes:

### 1. Template Configuration (template-config.json)
- Complete techStack object with all major dependencies
- Detailed features list (core, advanced, deployment)
- Project structure with logical folder organization
- Step-by-step setupSteps for automated initialization
- Git configuration with appropriate branches and hooks
- Customization variables and options

### 2. Core Project Files
- package.json with all necessary dependencies
- Configuration files (typescript, eslint, etc.)
- Main application structure files
- Development and build scripts

### 3. Memory Bank Template
- projectbrief.md template with industry-specific context
- techContext.md explaining the chosen technology stack
- systemPatterns.md covering architecture decisions
- Other core memory bank files

### 4. Integration Requirements
- How this template integrates with global Cursor rules
- Specific .cursorrules content for this project type
- Git automation patterns specific to this stack
- Development workflow considerations

## Analysis Guidelines:

### Technology Stack Analysis
1. **Core Framework**: Primary technology and version requirements
2. **Dependencies**: Essential packages and their purposes  
3. **Development Tools**: Build tools, linters, formatters, testing
4. **Deployment**: How projects using this stack are typically deployed
5. **Common Patterns**: Standard folder structures and architectural patterns

### Project Structure Design
1. **Logical Organization**: How files should be organized for this stack
2. **Scalability**: Structure that grows well from small to large projects
3. **Best Practices**: Following established conventions for this technology
4. **Separation of Concerns**: Clear boundaries between different aspects

### Setup Automation
1. **Installation Steps**: What needs to be installed and in what order
2. **Configuration**: What configuration files need to be created/modified
3. **Dependencies**: Package installations and their purposes
4. **Verification**: How to verify the setup worked correctly

### Customization Strategy
1. **Common Variables**: What aspects users typically want to customize
2. **Optional Features**: Features that should be toggleable during setup
3. **Industry Adaptations**: How this template can be adapted for different uses
4. **Scaling Options**: How to handle different project size requirements

## Expected Output Format:

### 1. Template Overview
Brief description of what this template provides and when to use it.

### 2. Complete template-config.json
Full configuration file with all required sections properly filled out.

### 3. Key Project Files
At least 3-5 critical files that form the foundation of projects using this template.

### 4. Memory Bank Templates
Templates for the core memory bank files with appropriate placeholders.

### 5. Integration Notes
How this template fits into the broader project management system.

### 6. Usage Examples
Example commands for creating projects with this template and common customizations.

Please provide a comprehensive analysis that follows the patterns established by existing templates (mobile-app, web-fullstack, etc.) while being specifically tailored to the [TECHNOLOGY STACK] requirements.
```

## Stack-Specific Prompts

### For Frontend Frameworks
```
Additional considerations for frontend framework templates:
- Component organization patterns
- State management setup
- Routing configuration
- Build optimization
- CSS/styling approach
- Testing strategies (unit, integration, e2e)
- Performance monitoring
- Accessibility considerations
```

### For Backend/API Templates
```
Additional considerations for backend templates:
- Database integration patterns
- Authentication/authorization setup
- API documentation generation
- Error handling strategies
- Logging and monitoring
- Security best practices
- Performance optimization
- Deployment strategies
```

### For Full-Stack Templates
```
Additional considerations for full-stack templates:
- Frontend/backend communication patterns
- Shared type definitions
- Development workflow (parallel development)
- Build and deployment coordination
- Testing strategies across the stack
- Environment configuration management
- Database migration strategies
```

### For Specialized Templates
```
Additional considerations for specialized templates:
- Domain-specific requirements
- Industry compliance considerations
- Specialized tooling integration
- Performance characteristics
- Scaling considerations
- Community best practices
- Integration with existing systems
```

## Template Validation Checklist

Before considering a template complete, verify:

- [ ] Can be initialized automatically without manual intervention
- [ ] All dependencies are properly specified with versions
- [ ] Project structure follows logical organization patterns
- [ ] Memory bank templates are comprehensive and informative
- [ ] Git configuration is appropriate for the project type
- [ ] Customization options cover common use cases
- [ ] Setup steps are clear and can be automated
- [ ] Integration with global Cursor rules works properly
- [ ] Generated projects follow best practices for the technology stack
- [ ] Documentation is complete and helpful

## Usage Instructions

1. Replace the bracketed placeholders with your specific technology stack
2. Run the prompt with an AI assistant capable of analyzing technology stacks
3. Review the generated template for completeness and accuracy
4. Test the template by creating a sample project
5. Iterate on any issues discovered during testing
6. Add the completed template to the templates directory

This prompt system ensures consistent, high-quality templates that integrate seamlessly with the project management system.
