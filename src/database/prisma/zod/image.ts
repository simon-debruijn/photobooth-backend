import * as z from 'zod';
import { Completeorder, RelatedorderModel } from './index';

export const imageModel = z.object({
  id: z.number().int(),
  order_id: z.number().int(),
});

export interface Completeimage extends z.infer<typeof imageModel> {
  order: Completeorder;
}

/**
 * RelatedimageModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedimageModel: z.ZodSchema<Completeimage> = z.lazy(() =>
  imageModel.extend({
    order: RelatedorderModel,
  }),
);
