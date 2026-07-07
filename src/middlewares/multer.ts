import multer from 'multer'

// মেমরিতে ফাইল রাখব (disk এ সেভ করব না, কারণ সরাসরি ImgBB তে পাঠাব)
const storage = multer.memoryStorage()

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Only .jpeg, .jpg, .png and .webp formats are allowed'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
})

export default upload
