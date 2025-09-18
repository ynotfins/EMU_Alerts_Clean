# Technical Context: EMU Alerts Clean

## Technology Stack
*To be determined based on requirements*

### Current Status
- **Repository**: Fresh Git repository initialized
- **Environment**: Linux development environment
- **Package Manager**: pnpm preferred (based on user preferences)
- **Build Tools**: Turbopack preferred for Next.js projects

### Technology Considerations

#### Backend Options
- **Node.js + Express/Fastify**: Rapid development, good ecosystem
- **Next.js API Routes**: Full-stack solution with React
- **Python + FastAPI**: Strong for data processing and APIs
- **Java Spring Boot**: Enterprise-grade, good for university environments

#### Frontend Options
- **Next.js + React**: Modern, fast development with Turbopack
- **React SPA**: Client-side application
- **Vue.js**: Alternative modern framework
- **Server-side rendered**: For better SEO and performance

#### Database Options
- **PostgreSQL**: Reliable relational database for complex queries
- **MongoDB**: Flexible document storage
- **SQLite**: Simple setup for development/small scale
- **MySQL**: Common in university environments

#### Notification Services
- **SendGrid/Mailgun**: Email delivery
- **Twilio**: SMS notifications
- **Firebase Cloud Messaging**: Push notifications
- **Amazon SNS**: Multi-channel notifications

## Development Setup

### Current Environment
- **OS**: Linux 6.12.8+
- **Shell**: /usr/bin/bash
- **Git**: Repository initialized and clean
- **Working Directory**: /workspace

### Development Tools (Preferences)
- **Package Manager**: pnpm
- **Build Tool**: Turbopack (for Next.js)
- **Testing**: Vitest (run before pushing changes)
- **Code Quality**: Linting and formatting tools
- **Agent Mode**: Terminal commands run automatically

### Installation Standards
- Use non-interactive flags (-y)
- Apply sensible defaults
- Always run tests before pushing changes
- Iterate until tests are green

## Technical Constraints

### Requirements (Assumed)
- **Reliability**: High availability for emergency alerts
- **Scalability**: Handle varying alert volumes
- **Security**: Protect user data and prevent spam
- **Performance**: Fast alert delivery (< 5 minutes urgent)
- **Maintainability**: Clean, documented codebase

### Integration Constraints
- May need integration with EMU systems
- Authentication requirements (LDAP, SSO)
- Compliance requirements (FERPA, etc.)
- Network/firewall considerations

## Dependencies
*To be defined as technology stack is chosen*

### Core Dependencies (Planned)
- Web framework
- Database driver/ORM
- Authentication library
- Notification service SDKs
- Testing framework
- Build and deployment tools

### Development Dependencies
- Linting tools (ESLint, etc.)
- Code formatting (Prettier)
- Type checking (TypeScript if chosen)
- Testing utilities
- Development servers

## Deployment Considerations
- **Environment**: TBD (cloud vs on-premise)
- **CI/CD**: Automated testing and deployment
- **Monitoring**: Application and alert delivery monitoring
- **Backup**: Database and configuration backup
- **Scaling**: Horizontal scaling for high loads

*Last Updated: September 18, 2025*