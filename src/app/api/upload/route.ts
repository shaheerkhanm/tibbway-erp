
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { Buffer } from 'buffer';

// We need to disable the default body parser to allow multer to handle the multipart/form-data.
export const config = {
  api: {
    bodyParser: false,
  },
};

async function handleUpload(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = formData.get('folder') as string || 'misc';

    if (!file) {
        return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadPath = path.join(process.cwd(), 'public', 'uploads', folder);
    
    try {
        await fs.mkdir(uploadPath, { recursive: true });
    } catch (error: any) {
        console.error("Error creating directory:", error);
        return NextResponse.json({ error: 'Failed to create upload directory.' }, { status: 500 });
    }

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.name);
    const filename = file.name.replace(/\.[^/.]+$/, "") + '-' + uniqueSuffix + extension;
    const filePath = path.join(uploadPath, filename);

    try {
        await fs.writeFile(filePath, buffer);
        const url = `/uploads/${folder}/${filename}`;
        return NextResponse.json({ message: 'File uploaded successfully', url });
    } catch (error) {
        console.error("Error writing file:", error);
        return NextResponse.json({ error: 'Failed to save file.' }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
  try {
    return await handleUpload(req);
  } catch (error: any) {
    console.error("Upload error:", error);
    let errorMessage = "An unknown error occurred during upload.";
    if (error.message) {
        errorMessage = error.message;
    }
    // Handle cases where the error might be related to body parsing limits
    if (error.type === 'entity.too.large') {
        errorMessage = `File size is too large. Please upload a file smaller than 2MB.`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
