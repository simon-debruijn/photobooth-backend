import * as z from 'zod';

import { Completeorder, RelatedorderModel } from './index';

export const userModel = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  password: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export interface Completeuser extends z.infer<typeof userModel> {
  order: Completeorder[];
}

/**
 * RelateduserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelateduserModel: z.ZodSchema<Completeuser> = z.lazy(() =>
  userModel.extend({
    order: RelatedorderModel.array(),
  }),
);
