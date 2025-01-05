# File Uploader Project

### Introduction

In this project, I build a stripped-down version of Google Drive. The File Uploader application allows users to manage their files and folders, providing a simple interface for uploading, organizing, and sharing files. This project is based on Odin project's requirements which could be found at https://www.theodinproject.com/lessons/nodejs-file-uploader

![Landing Page](docs/image.png)
*Landing page of the File Uploader application*

![Dashboard](docs/image_detail.png)
*Dashboard view showing uploaded files and folders*

## Features

- 🔐 Secure authentication using Passport.js with session persistence
- 📁 Create, read, update, and delete folders
- 📤 File upload functionality with Multer
- ☁️ Cloud storage integration (Cloudinary/Supabase)
- 🔗 Time-limited folder sharing capabilities
- 📊 File metadata viewing and management
- 💾 PostgreSQL database for data persistence

1. **Project Setup**:
  - Set up a new Node.js project using Express.
  - Install necessary dependencies, including Prisma and Passport.js for authentication.

2. **Session-Based Authentication**:
  - Implemented session-based authentication using Passport.js.
  - Used the Prisma session store library to persist user sessions in the database.

3. **File Uploading**:
  - Created a form for authenticated users to upload files.
  - Used the `multer` middleware to handle file uploads and saved the files in the filesystem.

4. **Folder Management**:
  - Implemented CRUD (Create, Read, Update, Delete) functionality for folders.
  - Allowed users to upload files into specific folders.
  - Set up routes and necessary database interactions for folder management.

5. **File Details View**:
  - Added a route to view specific file details, including name, size, and upload time.
  - Provided a download button for users to download the uploaded files.

6. **File Storage**:
  - Integrated a cloud storage service (Supabase) for file uploads.
  - When a file was uploaded, saved the file URL in the database for easy access.

7. **Share Folder Functionality**:
 - Feature that allows users to share a folder and all its contents.
 - Users can specify a duration for the shared link (e.g., 1 day, 10 days).
 - Generate a shareable link in the format: `https://yourapp.com/share/c758c495-0705-44c6-8bab-6635fd12cf81`, allowing unauthenticated users to access the shared folder.

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd file-uploader
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/file_uploader?schema=public"
SESSION_SECRET="your-secret-key"
```

4. Set up the database and run migrations:
```bash
npx prisma generate
npx prisma migrate dev
```

## Running the Application

1. Start the server:
```bash
cd src
node index.js
```

2. Access the application at `http://localhost:3000`


## Database Schema

The application uses the following Prisma schema:

- **User**: Stores user authentication details and relationships to files/folders
- **File**: Manages file metadata and relationships
- **Session**: Handles session persistence
- **Folder**: Organizes files into directories
- **SharedFolder**: Manages folder sharing functionality

