# Casino Scheduler Application

<div align="center">
  <img src="https://casino-scheduler-v1.vercel.app/images/dashboard.png" alt="Casino Scheduler Dashboard" width="800"/>
  <p><em>Smart scheduling for casino operations</em></p>
</div>

A Nextjs application for managing casino tables, presenters, and generating rotation schedules.

### Live Demo:

🎮 [Casino Scheduler Live App](https://casino-scheduler-v1.vercel.app/dashboard)

## Features

- **Tables Management**: Create, read, update, and delete casino tables
- **Presenter Management**: Manage game presenters with proper shifts, contact details
- **Automated Scheduling**: Generate rotation schedules for morning, afternoon, and night shifts
- **Dark Mode Support**: Full dark mode support throughout the application
- **Role-based Access Control**: Admin, manager, and viewer roles with appropriate permissions
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple View Options**: Grid and list views for presenters
- **Custom 404 Page**: Engaging casino-themed "Page Not Found" experience with animated dice

## Screenshots

### Dashboard Overview

![Dashboard Overview](https://casino-scheduler-v1.vercel.app/images/dashboard.png)
_The main dashboard provides a quick overview of key metrics and casino operations._

### Casino Tables Management

![Casino Tables](https://casino-scheduler-v1.vercel.app/images/casino_tables.png)
_Manage all your casino tables including their status, game type, and availability._

### Game Presenters

![Game Presenters](https://casino-scheduler-v1.vercel.app/images/game_presenters.png)
_View and manage your team of presenters with their availability and skills._

### Presenter Schedule

![Presenter Schedule](https://casino-scheduler-v1.vercel.app/images/presenter_schedule.png)
_The automated scheduling system ensures optimal presenter rotation for all tables._

## Developer Setup

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher (or yarn/pnpm if preferred)
- Git

### Clone and Install

```bash
# Clone the repository
git clone https://github.com/requiemcreatif/casino-scheduler-v1.git
cd casino-scheduler

# Install dependencies
npm install # or npm install --legacy-peer-deps
# or
yarn install
# or
pnpm install
```

### Environment Setup

No environment variables are required for local development as the application uses browser localStorage to simulate a backend API.

### Running the Application

```bash
# Start the development server
npm run dev
# or
yarn dev
# or
pnpm dev

# Build for production
npm run build

# Start the production server
npm start
```

When running locally, screenshots can be viewed at:

- http://localhost:3000/images/dashboard.png
- http://localhost:3000/images/casino_tables.png
- http://localhost:3000/images/game_presenters.png
- http://localhost:3000/images/presenter_schedule.png

### Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable React components
- `/lib` - Utility functions and API simulation
- `/models` - Business logic and data models
- `/providers` - React context providers
- `/app/mocks` - Mock data for development and testing
- `/public/images` - Application screenshots and images

## Scheduling Algorithm

The scheduler generates rotation schedules for game presenters across tables, ensuring:

- Each presenter gets at least one 20-minute break during their 8-hour shift
- Each active table has a presenter at all times
- Rotation follows a fair pattern

### Handling Insufficient Presenters

When there aren't enough presenters to staff all tables:

1. The algorithm prioritizes tables with lower numbers (1, 2, 3, etc.)
2. It staffs a maximum of (presenters - 1) tables to ensure breaks
3. Tables are selected in ascending order of table number
4. Each presenter still receives regular breaks

For example, with 4 presenters and 8 active tables, the system will:

- Schedule tables 1, 2, and 3 (using presenters - 1 = 3 tables)
- Ensure each presenter still gets regular breaks
- Show clear indicators on the UI about which tables are being staffed

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Login Information

The application comes with three pre-configured users:

- **Admin**: username: `admin`, password: `password`
- **Manager**: username: `manager`, password: `password`
- **Viewer**: username: `viewer`, password: `password`

Each role has different permissions:

- Admins can create, edit, and delete data
- Managers can create and edit data
- Viewers can only view data

## Docker Support

You can run the application using Docker:

```bash
# Build the Docker image
docker build -t casino-scheduler .

# Run the container
docker run -p 3000:3000 casino-scheduler
```

Or use Docker Compose (recommended):

```bash
docker-compose up
```

### Docker Configuration

The Docker setup uses Next.js in standalone mode which optimizes the image size and performance. The configuration includes:

- Node.js 18 Alpine for minimal image size
- Proper handling of Next.js application in standalone mode
- Health checks to ensure the application is running properly
- Production-ready environment settings

### Troubleshooting Docker Issues

If you encounter dependency conflicts when building the Docker image (particularly between React and testing libraries), the following has been done to resolve these issues:

1. **React Version**: The project now uses React 18.2.0 instead of React 19 to avoid compatibility issues with testing libraries and other dependencies.
2. **Legacy Peer Deps**: The Dockerfile has been configured to use the `--legacy-peer-deps` flag when installing dependencies.
3. **Multiple Package Managers**: The Docker build now supports both npm and yarn for better compatibility.

If you still face problems, try these solutions:

```bash
# Force rebuild without using cache
docker-compose build --no-cache app
docker-compose up

# Or run with explicit npm flags
docker build --build-arg NPM_FLAGS="--legacy-peer-deps --force" -t casino-scheduler .
docker run -p 3000:3000 casino-scheduler
```

#### Fixing Next.js Font Loader and Babel Conflicts

If you see an error like: `"next/font" requires SWC although Babel is being used due to a custom babel config being present`, this is due to a conflict between Next.js font system and Babel configuration. The Dockerfile has been modified to temporarily rename the Babel config during build.

You can also fix this manually:

```bash
# Rename Babel config before building
mv .babelrc.js .babelrc.js.bak

# Build as normal
npm run build

# Restore Babel config (needed for tests)
mv .babelrc.js.bak .babelrc.js
```

If you get errors about missing .next/standalone directory, make sure your next.config.js is properly configured to use output: 'standalone' mode.

## Technical Implementation

- Built with Next.js and React
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn Library
- Local storage for data persistence (simulating an API)
- React Context for state management
- Responsive UI design with clean visual hierarchy
- Application screenshots available in the `/public/images` directory

## Testing

The app includes a comprehensive test suite:

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### Testing Stack

- **Jest**: Testing framework for running tests and assertions
- **React Testing Library**: For testing React components
- **Babel**: Configured to properly process TypeScript and JSX in tests
- **Mock Service Worker**: For mocking API calls in tests

### Current Coverage

The test suite currently has the following coverage:

- **Overall**: ~75% statement coverage
- **Models**: 91% statement coverage, with key scheduling algorithm fully tested
- **Components**: 77% coverage for presenter components, 53% for UI components
- **Utilities**: 100% coverage

Areas for improvement:

- Additional tests for UI components, particularly modals
- More comprehensive testing of edge cases in component interactions
- Increase branch coverage (currently ~52%)

### Test Suite Contents

The test suite covers:

- Unit tests for utility functions and models
- Component tests for UI components
- Integration tests for key workflows

## Limitations and Future Improvements

- Currently uses browser localStorage instead of a real backend
- Create a database
- Using proper statement management (React query for CRUD and state management)
- Could add more sophisticated scheduling algorithms
- Would benefit from real-time updates between multiple users
- Design improvements (Adding more pages, components, animations)
- Additional test coverage needed
