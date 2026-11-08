/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    admin?: {
      userId: number;
      email: string;
      name: string;
    };
  }
}

