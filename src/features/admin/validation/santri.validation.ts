import { z } from "zod";


export const santriRegisterSchema = z.object({
  password: z.string().min(8, {message: "Kata sandi minimal 8 karakter" }),
  ortuId: z.array(z.number())
    .min(1, { message: "Minimal salah satu orang tua harus diisi" })
    .max(3, { message: "Hanya boleh maksimal 3 orang tua (ayah, ibu, wali)" }),
  nama: z.string().min(3, {message: "Nama minimal 3 karakter" }),
  tahapHafalan: z.enum(["Level1", "Level2", "Level3"]).refine((val) => val === "Level1" || val === "Level2" || val === "Level3", {message: "Tahap hafalan harus di isi" }),
});

export const santriUpdateSchemaAdmin = santriRegisterSchema.omit({ password: true });