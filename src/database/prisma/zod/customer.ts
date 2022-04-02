import * as z from "zod"
import { Completeorder, RelatedorderModel } from "./index"

export const customerModel = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  password: z.string(),
  tokens: z.string().array().optional(),
})

export interface Completecustomer extends z.infer<typeof customerModel> {
  order: Completeorder[]
}

/**
 * RelatedcustomerModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedcustomerModel: z.ZodSchema<Completecustomer> = z.lazy(() => customerModel.extend({
  order: RelatedorderModel.array(),
}))
