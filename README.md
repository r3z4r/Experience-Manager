# Experience Manager - Admin Portal

A modern content management system built with Next.js and PayloadCMS for managing experiences and content.

## Features

- 🚀 Built with Next.js 15 and PayloadCMS
- 💾 MongoDB database integration
- 📝 Rich text editing with Lexical Editor
- 🖼️ Media and image management
- 📱 Responsive admin interface
- 🎨 GrapesJS page builder integration
- 🔒 User authentication and authorization
- 🎯 TypeScript support

## Prerequisites

- Node.js (as per package.json)
- MongoDB database
- Environment variables setup

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection URI (required)
DATABASE_URI=mongodb://127.0.0.1/payloadcms

# Secret key for PayloadCMS (required)
# Generate a strong secret key for production
PAYLOAD_SECRET=your-secret-key-here

# PayloadCMS URL (required)
# Development: http://localhost:3000
# Production: Your production URL
PAYLOADCMS_URL=http://localhost:3000
```

### MongoDB URI Configuration

The `DATABASE_URI` supports several formats:

1. **Local MongoDB:**

   ```
   mongodb://127.0.0.1/payloadcms
   ```

2. **MongoDB Atlas:**

   ```
   mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority
   ```

3. **MongoDB with Authentication:**
   ```
   mongodb://<username>:<password>@127.0.0.1:27017/payloadcms
   ```

Replace the placeholders:

- `<username>`: Your MongoDB username
- `<password>`: Your MongoDB password
- `<cluster-url>`: Your MongoDB cluster URL (for Atlas)
- `<database-name>`: Your database name (default: payloadcms)

### Setting Up MongoDB

1. **Local MongoDB:**

   - Install MongoDB Community Edition
   - Start MongoDB service:
     ```bash
     sudo systemctl start mongod
     ```
   - Verify MongoDB is running:
     ```bash
     mongo --eval 'db.runCommand({ connectionStatus: 1 })'
     ```

2. **MongoDB Atlas:**
   - Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a new cluster
   - Click "Connect" and choose "Connect your application"
   - Copy the connection string and replace `<password>` with your database user password

### Security Notes

- Never commit `.env` file to version control
- Use strong, unique `PAYLOAD_SECRET` in production
- Restrict MongoDB access with proper authentication
- Use environment-specific configuration for different deployments

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
```

For a clean development start:

```bash
npm run devsafe
# or
yarn devsafe
```

## Build and Production

Build the application:

```bash
npm run build
# or
yarn build
```

Start the production server:

```bash
npm run start
# or
yarn start
```

## Project Structure

- `/app` - Next.js application routes and components
- `/collections` - PayloadCMS collections (Users, Media, Pages, Images)
- `/lib` - Utility functions and shared code
- `/public` - Static assets
- `/utils` - Helper functions

## Docker Support

The project includes Docker configuration for containerized deployment:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Technologies Used

- Next.js 15.0.3
- PayloadCMS (latest)
- MongoDB
- GrapesJS
- TypeScript
- Tailwind CSS
- React 19.0.0-rc

## Scripts

- `dev`: Start development server
- `build`: Build for production
- `devsafe`: Clean start development server
- `generate:types`: Generate PayloadCMS types
- `generate:importmap`: Generate import map
- `lint`: Run ESLint
- `start`: Start production server
