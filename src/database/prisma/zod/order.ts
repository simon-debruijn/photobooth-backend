import * as z from 'zod';
import { Decimal } from 'decimal.js';
import { Completeuser, RelateduserModel } from './index';

// Helper schema for Decimal fields
z.instanceof(Decimal)
  .or(z.string())
  .or(z.number())
  .refine((value) => {
    try {
      return new Decimal(value);
    } catch (error) {
      return false;
    }
  })
  .transform((value) => new Decimal(value));

export const orderModel = z.object({
  id: z.number().int().optional(),
  user_id: z.number().int(),
  url_friendly_id: z.string().nullish(),
  title: z.string(),
  description: z.string().nullish(),
  price: z.number(),
  images: z.string().array().optional(),
});

export interface Completeorder extends z.infer<typeof orderModel> {
  user: Completeuser;
}

/**
 * RelatedorderModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedorderModel: z.ZodSchema<Completeorder> = z.lazy(() =>
  orderModel.extend({
    user: RelateduserModel,
  }),
);
