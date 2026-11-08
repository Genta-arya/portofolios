import type { APIRoute } from 'astro';
import { uploadImageBuffer, deleteCloudinaryImage } from '../../../lib/cloudinary';

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'gentha-portfolio';

    if (!file) {
      return new Response(JSON.stringify({ error: 'File gambar wajib disertakan' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await uploadImageBuffer(buffer, folder);

    return new Response(JSON.stringify({ success: true, ...result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Gagal mengunggah gambar ke Cloudinary' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  try {
    const publicId = url.searchParams.get('public_id');

    if (!publicId) {
      return new Response(JSON.stringify({ error: 'public_id is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const success = await deleteCloudinaryImage(publicId);
    return new Response(JSON.stringify({ success }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
