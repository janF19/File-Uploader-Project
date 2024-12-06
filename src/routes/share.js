const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

// Helper function to calculate expiration date
const calculateExpirationDate = (duration) => {
    const days = parseInt(duration.replace('d', ''));
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
};

// Create share link
router.post('/folder/:folderId/share', async (req, res) => {
    try {
        console.log('Received share request:', { 
            folderId: req.params.folderId, 
            duration: req.body.duration 
        }); // Debug log

        const { folderId } = req.params;
        const { duration } = req.body;

        // Verify folder exists
        const folder = await prisma.folder.findUnique({
            where: { id: parseInt(folderId) }
        });

        if (!folder) {
            return res.status(404).json({ error: 'Folder not found' });
        }

        // Create share record
        const sharedFolder = await prisma.sharedFolder.create({
            data: {
                folderId: parseInt(folderId),
                expiresAt: calculateExpirationDate(duration),
                accessToken: crypto.randomUUID()
            }
        });

        console.log('Created shared folder:', sharedFolder); // Debug log

        // Generate share URL
        const shareUrl = `${req.protocol}://${req.get('host')}/share/${sharedFolder.accessToken}`;
        
        res.json({ shareUrl });
    } catch (error) {
        console.error('Error creating share link:', error);
        res.status(500).json({ error: 'Failed to create share link' });
    }
});


router.get('/:accessToken', async (req, res) => {
    try {
        const { accessToken } = req.params;
        
        const sharedFolder = await prisma.sharedFolder.findUnique({
            where: { accessToken },
            include: {
                folder: {
                    include: {
                        files: true
                    }
                }
            }
        });

        if (!sharedFolder) {
            return res.status(404).render('error', { 
                message: 'Share link not found or has expired'
            });
        }

        // Check if share has expired
        if (sharedFolder.expiresAt < new Date()) {
            return res.status(410).render('error', { 
                message: 'This share link has expired'
            });
        }

        // Render the shared folder view
        res.render('shared-folder', {
            folder: sharedFolder.folder,
            files: sharedFolder.folder.files,
            expiresAt: sharedFolder.expiresAt
        });

    } catch (error) {
        console.error('Error accessing shared folder:', error);
        res.status(500).render('error', { 
            message: 'Error accessing shared folder'
        });
    }
});

module.exports = router;