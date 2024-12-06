
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Add this import
const { PrismaClient } = require('@prisma/client');
const { ensureAuthenticated } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = 'uploads';
      if (!fs.existsSync(uploadDir)){
          fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + file.originalname;
      cb(null, uniqueSuffix);
    }
  });
  const upload = multer({ 
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit
    }
  });





router.get('/', ensureAuthenticated, async (req, res) => {
    try {
        const folders = await prisma.folder.findMany({
            where: { userId: req.user.id },
            include: { files: true }
        });
        
        const unorganizedFiles = await prisma.file.findMany({
            where: { 
                userId: req.user.id,
                folderId: null
            }
        });
        
        res.render('files', { folders, unorganizedFiles });
    } catch (error) {
        console.error('Error fetching files:', error);
        res.status(500).send('Error fetching files');
    }
});


// File upload route
router.post('/upload', ensureAuthenticated, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const { filename, mimetype, size, path: filePath } = req.file;
        const folderId = req.body.folderId ? parseInt(req.body.folderId) : null;

        await prisma.file.create({
            data: {
                filename,
                mimetype,
                size,
                path: filePath,
                userId: req.user.id,
                folderId
            }
        });

        res.redirect('/files');
    } catch (error) {
        console.error('File upload error:', error);
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error deleting file:', err);
            });
        }
        res.status(500).send('Error uploading file');
    }
});






router.post('/folders', ensureAuthenticated, async (req, res) => {
    try {
      const { name } = req.body;
      await prisma.folder.create({
        data: {
          name,
          userId: req.user.id
        }
      });
      res.redirect('/files');
    } catch (err) {
      res.status(500).send('Error creating folder');
    }
  });


 
router.put('/folders/:id', ensureAuthenticated, async (req, res) => {
    try {
      const { name } = req.body;
      await prisma.folder.update({
        where: { id: parseInt(req.params.id) },
        data: { name }
      });
      res.redirect('/files');
    } catch (err) {
      res.status(500).send('Error updating folder');
    }
  });



// File delete route (works for both organized and unorganized files)
router.delete('/files/:id', ensureAuthenticated, async (req, res) => {
    try {
        const file = await prisma.file.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { folder: true } // Include folder info
        });

        if (!file || file.userId !== req.user.id) {
            return res.status(404).send('File not found');
        }

        // Delete the physical file
        fs.unlinkSync(file.path);

        // Delete the database record
        await prisma.file.delete({
            where: { id: parseInt(req.params.id) }
        });

        // Redirect back to the folder if file was in a folder
        if (file.folderId) {
            res.redirect(`/files/folders/${file.folderId}`);
        } else {
            res.redirect('/files');
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).send('Error deleting file');
    }
});


// Folder delete route with cascade delete of files
router.delete('/folders/:id', ensureAuthenticated, async (req, res) => {
    try {
        // First check if folder exists and belongs to user
        const folder = await prisma.folder.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { files: true }
        });

        if (!folder || folder.userId !== req.user.id) {
            return res.status(404).send('Folder not found');
        }

        // Delete all physical files in the folder
        for (const file of folder.files) {
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error(`Error deleting file ${file.path}:`, err);
            }
        }

        // Delete the folder and all its files from database
        await prisma.folder.delete({
            where: { id: parseInt(req.params.id) }
        });

        res.redirect('/files');
    } catch (error) {
        console.error('Folder delete error:', error);
        res.status(500).send('Error deleting folder');
    }
});


 
router.get('/folders/:id', ensureAuthenticated, async (req, res) => {
    try {
      const folder = await prisma.folder.findUnique({
        where: { id: parseInt(req.params.id) },
        include: { files: true }
      });
      
      if (!folder || folder.userId !== req.user.id) {
        return res.status(404).send('Folder not found');
      }
      
      res.render('folder', { folder });
    } catch (err) {
      res.status(500).send('Error retrieving folder');
    }
  });
  




// File download route
router.get('/download/:id', ensureAuthenticated, async (req, res) => {
    try {
        const file = await prisma.file.findUnique({
            where: { id: parseInt(req.params.id) }
        });

        if (!file || file.userId !== req.user.id) {
            return res.status(404).send('File not found');
        }

        if (!fs.existsSync(file.path)) {
            await prisma.file.delete({ where: { id: file.id } });
            return res.status(404).send('File not found on disk');
        }

        res.download(file.path, file.filename);
    } catch (error) {
        console.error('Download error:', error);
        res.status(500).send('Error downloading file');
    }
});



//getting file details

router.get('/files/:id/details', ensureAuthenticated, async (req, res) => {
    try {
        const file = await prisma.file.findUnique({
            where: { id: parseInt(req.params.id) },
            include: { folder: true }
        });

        if (!file || file.userId !== req.user.id) {
            return res.status(404).json({ error: 'File not found' });
        }

        res.json({
            filename: file.filename,
            size: `${(file.size / 1024).toFixed(2)} KB`,
            mimetype: file.mimetype,
            uploadedAt: new Date(file.createdAt).toLocaleString(),
            folder: file.folder ? file.folder.name : 'Unorganized'
        });
    } catch (error) {
        console.error('Error fetching file details:', error);
        res.status(500).json({ error: 'Error fetching file details' });
    }
});



module.exports = router;


