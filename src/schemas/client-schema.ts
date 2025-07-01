import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome não pode exceder 100 caracteres" }),
  email: z
    .string()
    .email({ message: "Email inválido" })
    .nullable()
    .or(z.string().length(0).transform(() => null)),
  phone: z
    .string()
    .nullable()
    .or(z.string().length(0).transform(() => null)),
});

export type ClientFormValues = z.infer<typeof clientSchema>;