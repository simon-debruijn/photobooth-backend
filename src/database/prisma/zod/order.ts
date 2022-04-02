import * as z from "zod"
import { Completecustomer, RelatedcustomerModel, Completeimage, RelatedimageModel } from "./index"

export const orderModel = z.object({
  id: z.number().int().optional(),
  customer_id: z.number().int(),
})

export interface Completeorder extends z.infer<typeof orderModel> {
  customer: Completecustomer
  image: Completeimage[]
}

/**
 * RelatedorderModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedorderModel: z.ZodSchema<Completeorder> = z.lazy(() => orderModel.extend({
  customer: RelatedcustomerModel,
  image: RelatedimageModel.array(),
}))
