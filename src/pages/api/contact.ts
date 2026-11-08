import type { APIRoute } from 'astro';
import { db } from '../../db';
import { contactMessages } from '../../db/schema';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().email('Format email tidak valid'),
  serviceInterest: z.string().optional(),
  message: z.string().min(10, 'Pesan minimal 10 karakter'),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = contactSchema.parse(body);

    await db.insert(contactMessages).values({
      senderName: validated.name,
      senderEmail: validated.email,
      serviceInterest: validated.serviceInterest || 'General Inquiry',
      message: validated.message,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Terima kasih! Pesan Anda telah berhasil terkirim.',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ success: false, errors: error.errors.map((e) => e.message) }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.error('Contact API error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Gagal mengirim pesan, silakan coba lagi.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

