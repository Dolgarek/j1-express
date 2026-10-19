// Les types et les schémas de validation de Team. Hier : l'entité Team + ses #[Assert\…].
import { z } from 'zod';

export interface Team {
  id: number;
  name: string;
  tag: string;
  country: string;
}

// ?country=be : deux lettres, mises en majuscules
export const TeamQuerySchema = z.object({
  country: z
    .string()
    .regex(/^[A-Za-z]{2}$/)
    .transform((s) => s.toUpperCase())
    .optional(),
});
export type TeamQuery = z.infer<typeof TeamQuerySchema>;
