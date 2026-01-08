import { z } from "zod";

const MAX_FILE_SIZE = 1000000; // 1 MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];

export const ustadRegisterSchema = z.object({
    email: z.string().email({message: "Email tidak valid" }),
    password: z.string().min(8, {message: "Kata sandi minimal 8 karakter" }),
    nama: z.string().min(3, {message: "Nama minimal 3 karakter" }),
    nomorTelepon: z.string().min(10, {message: "Nomor telepon minimal 10 karakter" }),
    alamat: z.string().min(3, {message: "Alamat minimal 3 karakter" }),
    jenisKelamin: z.enum(["L", "P"]).refine((val) => val === "L" || val === "P", {message: "Jenis kelamin harus di isi" }),
    waliKelasTahap: z.union([
      z.enum(["Level1", "Level2", "Level3"]),
      z.literal(""),
    ]).optional(),
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

export const ustadUpdateSchemaAdmin = ustadRegisterSchema.omit({ email: true, password: true, });

export const updateEmailPasswordSchema = z.object({
    email: z.string().email({message: "Email tidak valid" }).optional(),
    password: z.string().min(8, {message: "Kata sandi minimal 8 karakter" }).optional(),
});