import multer from 'multer';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) =>{
    const filename = `${Date.now()}_${file.originalname}`;
    cb(null, filename);
  }
});

const uploads = multer({storage: storage});

export default uploads;