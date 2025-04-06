# Changelog

All notable changes to the Event-FeedBack project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.4] - 2025-04-06

### Fixed
- Added Node.js runtime directives to all model schema files and utility files that use Mongoose
- Updated function pattern in `vercel.json` from `api/**` to `app/api/**/*` to correctly match the Next.js App Router structure
- Fixed "Dynamic Code Evaluation not allowed in Edge Runtime" error with Mongoose
- Ensured all files using MongoDB/Mongoose explicitly use Node.js runtime
- Resolved "The pattern doesn't match any Serverless Functions" error

## [1.5.3] - 2025-04-06

### Fixed
- Corrected the runtime specification in `vercel.json` to use the proper format (@vercel/node@2.15.3)
- Fixed Function Runtime error during Vercel deployment
- Updated functions pattern in `vercel.json` to match the Next.js App Router API route structure 
- Resolved "The pattern doesn't match any Serverless Functions" error
- Added Node.js runtime directives to all nested API routes (login, register, logout)

## [1.5.2] - 2025-04-06

### Added
- New `vercel.json` configuration file for optimized Vercel deployments
- Comprehensive Vercel deployment guide (VERCEL_DEPLOYMENT.md)
- Runtime directives to API routes to ensure Node.js runtime usage

### Changed
- Simplified MongoDB connection handling for better serverless compatibility
- Updated Next.js configuration to remove environment variables from code
- Updated package dependencies to their latest versions
- Modified middleware to avoid Edge Runtime for MongoDB-dependent routes

### Fixed
- Edge Runtime compatibility issues with Mongoose
- Missing environment variables errors during build
- Deprecated packages warnings

## [1.5.1] - 2025-04-03

### Added
- Detailed changelog documenting project evolution
- More comprehensive error messages for users
- Local storage for user preferences

### Fixed
- Minor UI issues in dark mode
- Improved loading states and error indicators
- Better handling of API rate limiting 

## [1.0.0] - 2024-09-28

### Added
- Initial release of Event-FeedBack Chatbot
- Core application structure using Next.js, React, and TypeScript
- Basic chat interface components (Chat.tsx, Message.tsx, UserInput.tsx)
- Initial API routes setup
- Project configuration files (package.json, .env, tsconfig.json)
- Documentation and README

## [1.1.0] - 2024-10-12

### Added
- OpenAI API integration for natural language responses
- Environment configuration for API keys
- Basic sentiment analysis for feedback
- Error handling for API calls
- Loading indicators during API requests

### Changed
- Enhanced chat UI with improved message styling
- Updated README with OpenAI integration details

## [1.2.0] - 2024-10-25

### Added
- MongoDB database integration
- Proper data schemas (feedback.schema.ts, event.schema.ts, user.schema.ts)
- JWT authentication system with login/register/logout endpoints
- Protected routes via middleware
- Data persistence for chat history and feedback

### Changed
- Migrated from in-memory storage to MongoDB
- Refactored API routes for better separation of concerns
- Enhanced error handling throughout the application

## [1.3.0] - 2024-11-08

### Added
- Analytics dashboard for visualizing feedback data
- Admin interface for managing events and users
- Rate limiting for API endpoints
- Comprehensive security measures
- Advanced type-safe interfaces throughout the codebase

### Changed
- Improved UI/UX for both user and admin interfaces
- Enhanced API response structure
- Better error feedback to users

## [1.4.0] - 2025-02-22

### Added
- NVIDIA API integration for enhanced chat completions
- Static response library for fallback scenarios
- In-memory storage backup for offline operation
- Improved MongoDB connection handling
- Enhanced error handling for both API and database connections

### Changed
- Updated chat API routes to support new AI provider
- Removed UI indicators of specific AI providers
- Refactored code for better maintainability

## [1.5.0] - 2025-03-16

### Added
- Groq API integration using LLama 3.3 70B model
- Dark mode support with user preference persistence
- Comprehensive settings panel with multiple options
- Help center with detailed documentation
- Sound notifications for messages
- Multi-language support foundation

### Changed
- Replaced OpenAI/NVIDIA APIs with Groq integration
- Updated `README.md` with comprehensive project information
- Enhanced security by removing exposed API keys
- Updated chat interface with improved focus handling
- Modified Tailwind configuration to support dark mode

### Fixed
- Input focus issue in chat that required repeated clicking
- MongoDB connection error handling
- API fallback mechanisms for better offline support
