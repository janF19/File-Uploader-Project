# File Uploader

### Introduction

In this project, I build a stripped-down version of Google Drive. The File Uploader application allows users to manage their files and folders, providing a simple interface for uploading, organizing, and sharing files. This project is based on Odin project's requirements which could be found at https://www.theodinproject.com/lessons/nodejs-file-uploader

### Assignment

This project involves setting up a new application using Express and Prisma, along with implementing various features for file management. Below are the key components of the project:

### Features

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

### Technologies Used

- **Node.js**: JavaScript runtime for building the server-side application.
- **Express**: Web framework for Node.js to handle routing and middleware.
- **Prisma**: ORM for database interactions and schema management.
- **Passport.js**: Middleware for authentication.
- **Multer**: Middleware for handling file uploads.
- **Supabase**: Cloud storage service for storing uploaded files.

### Getting Started

To get started with the project, follow these steps:

1. Clone the repository:
  ```bash
  git clone https://github.com/yourusername/file-uploader.git
  cd file-uploader


2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up your environment variables in a `.env` file:
   ```plaintext
   DATABASE_URL="your_database_url"
   SUPABASE_URL="your_supabase_url"
   SUPABASE_ANON_KEY="your_supabase_anon_key"
   ```

4. Run the application:
   ```bash
   npm run dev
   ```

5. Access the application in your browser at `http://localhost:3000`.

### Contributing
Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.

### License
This project is licensed under the MIT License.