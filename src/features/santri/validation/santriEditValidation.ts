import { z } from "zod";

const MAX_FILE_SIZE = 1000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const santriEditProfileSchema = z.object({
  nama: z.string().min(3, {message: "Nama minimal 3 karakter" }),
  nomorTelepon: z.string().min(10, {message: "Nomor telepon minimal 10 karakter" }),
  alamat: z.string().min(3, {message: "Alamat minimal 3 karakter" }),
  jenisKelamin: z.enum(["L", "P"]).refine((val) => val === "L" || val === "P", {message: "Jenis kelamin harus di isi" }),
  tanggalLahir: z.string().min(1, {message: "Tanggal lahir harus di isi" }),
  foto: z.custom<File | undefined>().optional().refine((file) => {
    if (!file) {
      return true;
    }
    // Validasi size file
    return file.size <= MAX_FILE_SIZE;
  }, `Ukuran foto tidak boleh lebih dari 1MB.`)
      .refine((file) => {
        if (!file) {
          return true;
        }
        // Validasi type file
        return ACCEPTED_IMAGE_TYPES.includes(file.type);
      }, "Hanya file .jpg, .jpeg, dan .png yang diizinkan."),
});
