# Casino Scheduler Application

A React-based application for managing casino tables, presenters, and generating rotation schedules.

## Features

- **Tables Management**: Create, read, update, and delete casino tables
- **Presenter Management**: Manage game presenters with proper shifts, contact details
- **Automated Scheduling**: Generate rotation schedules for morning, afternoon, and night shifts
- **Dark Mode Support**: Full dark mode support throughout the application
- **Role-based Access Control**: Admin, manager, and viewer roles with appropriate permissions
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple View Options**: Grid and list views for presenters
- **Custom 404 Page**: Engaging casino-themed "Page Not Found" experience with animated dice

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

You can also run the application using Docker:

```bash
# Build the Docker image
docker build -t casino-scheduler .

# Run the container
docker run -p 3000:3000 casino-scheduler
```

Or use Docker Compose:

```bash
docker-compose up
```

## Technical Implementation

- Built with Next.js and React
- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn Library
- Local storage for data persistence (simulating an API)
- React Context for state management

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

### Writing Tests

When writing tests:

1. Use descriptive test names
2. Follow the Arrange-Act-Assert pattern
3. Mock external dependencies
4. Test both success and error cases

## Limitations and Future Improvements

- Currently uses browser localStorage instead of a real backend
- Could add more sophisticated scheduling algorithms
- Would benefit from real-time updates between multiple users
- Additional test coverage needed

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
