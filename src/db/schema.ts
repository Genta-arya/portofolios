import {
  mysqlTable,
  int,
  varchar,
  text,
  boolean,
  timestamp,
  json,
  mysqlEnum,
} from 'drizzle-orm/mysql-core';

// 1. Users (Admin Auth)
export const users = mysqlTable('users', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  email: varchar('email', { length: 150 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 2. Site Settings (Profile, Socials, Stats)
export const siteSettings = mysqlTable('site_settings', {
  id: int('id').primaryKey().default(1),
  fullName: varchar('full_name', { length: 100 }).default('Gentha Arya Pratama'),
  roleTitle: varchar('role_title', { length: 150 }).default('Fullstack Developer · Web & Mobile'),
  shortBio: text('short_bio'),
  aboutDescription: text('about_description'),
  availableForHire: boolean('available_for_hire').default(true),
  heroAvatarUrl: varchar('hero_avatar_url', { length: 500 }),
  heroAvatarPublicId: varchar('hero_avatar_public_id', { length: 255 }),
  resumeUrl: varchar('resume_url', { length: 500 }),
  githubUrl: varchar('github_url', { length: 255 }),
  linkedinUrl: varchar('linkedin_url', { length: 255 }),
  instagramUrl: varchar('instagram_url', { length: 255 }),
  fastworkUrl: varchar('fastwork_url', { length: 255 }),
  whatsappNumber: varchar('whatsapp_number', { length: 50 }),
  emailContact: varchar('email_contact', { length: 150 }),
  statsCategoriesCount: int('stats_categories_count').default(3),
  statsProjectsCount: varchar('stats_projects_count', { length: 20 }).default('15+'),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 3. Services (Layanan Profesional)
export const services = mysqlTable('services', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 150 }).notNull(),
  subtitle: varchar('subtitle', { length: 200 }).notNull(),
  description: text('description').notNull(),
  iconName: varchar('icon_name', { length: 80 }),
  tags: json('tags').$type<string[]>(),
  ctaUrl: varchar('cta_url', { length: 500 }),
  displayOrder: int('display_order').default(0),
  isActive: boolean('is_active').default(true),
});

// 4. Projects (Portofolio Proyek)
export const projects = mysqlTable('projects', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 200 }).notNull(),
  slug: varchar('slug', { length: 220 }).notNull().unique(),
  category: mysqlEnum('category', ['web_app', 'mobile_app', 'landing_page']).notNull(),
  subcategoryBadge: varchar('subcategory_badge', { length: 100 }),
  shortDescription: text('short_description').notNull(),
  fullContent: text('full_content'),
  techStack: json('tech_stack').$type<string[]>().notNull(),
  thumbnailUrl: varchar('thumbnail_url', { length: 500 }).notNull(),
  thumbnailPublicId: varchar('thumbnail_public_id', { length: 255 }),
  galleryImages: json('gallery_images').$type<{ url: string; publicId?: string; caption?: string }[]>(),
  liveDemoUrl: varchar('live_demo_url', { length: 500 }),
  githubRepoUrl: varchar('github_repo_url', { length: 500 }),
  hireCtaUrl: varchar('hire_cta_url', { length: 500 }),
  isFeatured: boolean('is_featured').default(true),
  displayOrder: int('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 5. Tech Stacks (Keahlian & Teknologi)
export const techStacks = mysqlTable('tech_stacks', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  roleLabel: varchar('role_label', { length: 100 }),
  category: mysqlEnum('category', ['frontend', 'backend', 'mobile', 'database', 'devops']).notNull(),
  iconUrl: varchar('icon_url', { length: 500 }),
  glowColor: varchar('glow_color', { length: 30 }).default('#8B5CF6'),
  displayOrder: int('display_order').default(0),
});

// 6. Blog Categories
export const blogCategories = mysqlTable('blog_categories', {
  id: int('id').autoincrement().primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  description: varchar('description', { length: 255 }),
});

// 7. Blog Posts (Artikel / Berita)
export const blogPosts = mysqlTable('blog_posts', {
  id: int('id').autoincrement().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  coverImageUrl: varchar('cover_image_url', { length: 500 }).notNull(),
  coverImagePublicId: varchar('cover_image_public_id', { length: 255 }),
  categoryId: int('category_id'),
  tags: json('tags').$type<string[]>(),
  status: mysqlEnum('status', ['draft', 'published', 'archived']).default('draft'),
  isFeatured: boolean('is_featured').default(false),
  readingTimeMinutes: int('reading_time_minutes').default(3),
  viewsCount: int('views_count').default(0),
  seoTitle: varchar('seo_title', { length: 255 }),
  seoDescription: varchar('seo_description', { length: 320 }),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
});

// 8. Contact Messages (Pesan Masuk Pengunjung)
export const contactMessages = mysqlTable('contact_messages', {
  id: int('id').autoincrement().primaryKey(),
  senderName: varchar('sender_name', { length: 150 }).notNull(),
  senderEmail: varchar('sender_email', { length: 150 }).notNull(),
  serviceInterest: varchar('service_interest', { length: 100 }),
  message: text('message').notNull(),
  isRead: boolean('is_read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Type definitions export
export type User = typeof users.$inferSelect;
export type SiteSettings = typeof siteSettings.$inferSelect;
export type Service = typeof services.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type TechStack = typeof techStacks.$inferSelect;
export type BlogCategory = typeof blogCategories.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;

