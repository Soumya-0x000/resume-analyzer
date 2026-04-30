import multer from 'multer';

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['pdf'];
        const allowedMimeTypes = [
            'application/pdf',
            'application/x-pdf',
            'application/octet-stream',
        ];
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        const fileMimetype = file.mimetype;

        if (allowedExtensions.includes(fileExtension) && allowedMimeTypes.includes(fileMimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
});

export default upload;
