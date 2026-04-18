import { z } from "zod";


export const santriEditProfileSchema = z.object({
  nama: z.string().min(3, {message: "Nama minimal 3 karakter" }),
});
