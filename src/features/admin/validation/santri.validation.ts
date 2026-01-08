import { z } from "zod";

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const santriRegisterSchema = z.object({
  email: z.string().email({message: "Email tidak valid" }),
  password: z.string().min(8, {message: "Kata sandi minimal 8 karakter" }),
  ortuId: z.array(z.number())
    .min(1, { message: "Minimal salah satu orang tua harus diisi" })
    .max(3, { message: "Hanya boleh maksimal 3 orang tua (ayah, ibu, wali)" }),
  nama: z.string().min(3, {message: "Nama minimal 3 karakter" }),
  noInduk: z.string().min(1, {message: "No induk minimal 1 karakter" }),
  nomorTelepon: z.string().optional(),
  alamat: z.string().min(3, {message: "Alamat minimal 3 karakter" }),
  jenisKelamin: z.enum(["L", "P"]).refine((val) => val === "L" || val === "P", {message: "Jenis kelamin harus di isi" }),
  tanggalLahir: z.string().min(1, {message: "Tanggal lahir harus di isi" }),
  tahapHafalan: z.enum(["Level1", "Level2", "Level3"]).refine((val) => val === "Level1" || val === "Level2" || val === "Level3", {message: "Tahap hafalan harus di isi" }),
  foto: z.custom<File | undefined>().optional().refine((file) => {
    if (!file) {
      return true;
    }
    return file.size <= MAX_FILE_SIZE;
  }, `Ukuran foto tidak boleh lebih dari 1MB.`)
      .refine((file) => {
        if (!file) {
          return true;
        }
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      }, "Hanya file .jpg, .jpeg, dan .png yang diizinkan."),
});

export const santriUpdateSchemaAdmin = santriRegisterSchema.omit({ email: true, password: true, });