import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .endsWith('@gmail.com', 'Only Gmail accounts allowed for demo'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/\d/, 'Password must contain at least 1 number'),
});

export const signupSchema = loginSchema.extend({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be at most 50 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const placeSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be at most 100 characters'),
  category: z.enum(['Street Food', 'Cafe', 'Restaurant', 'Fast Food', 'Dessert', 'Other'] as const),
  tags: z
    .array(z.string())
    .min(1, 'At least one tag is required')
    .max(10, 'Maximum 10 tags allowed'),
  cuisine: z.string().optional(),
  coordinates: z.tuple([
    z.number().min(-90).max(90),
    z.number().min(-180).max(180),
  ]),
  address: z.string().optional(),
  openTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:mm'),
  closeTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format. Use HH:mm'),
  priceRange: z.string().optional(),
  isVeg: z.boolean().optional(),
  description: z
    .string()
    .max(500, 'Description must be at most 500 characters')
    .optional(),
  photos: z
    .array(z.string().url('Invalid photo URL'))
    .max(5, 'Maximum 5 photos allowed')
    .optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type PlaceInput = z.infer<typeof placeSchema>;
