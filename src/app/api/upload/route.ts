
import { NextRequest, NextResponse } from 'next/server';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';

// We need to disable the default body parser to allow multer to handle the multipart/form-data.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    // The folder will be passed in the form data
    const folder = (req as any).body.folder || 'misc';
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', folder);
    
    // Ensure the directory exists
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error: any) {
      cb(error, uploadPath);
    }
  },
  filename: (req, file, cb) => {
    // Create a unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

const runMiddleware = (req: NextRequest, res: NextResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};

export async function POST(req: NextRequest) {
  const res = new NextResponse();
  try {
    await runMiddleware(req, res, upload.single('file'));
    
    // After upload, the file info is in (req as any).file
    const file = (req as any).file;
    if (!file) {
        return NextResponse.json({ error: "File not uploaded correctly." }, { status: 400 });
    }

    // Construct the public URL
    const folder = (req as any).body.folder || 'misc';
    const url = `/uploads/${folder}/${file.filename}`;
    
    return NextResponse.json({ message: 'File uploaded successfully', url });
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
