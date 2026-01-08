export interface OrtuData {
  id: number;
  userId: number;
  nama: string;
  nomorHp: string;
  alamat: string;
  jenisKelamin: string;
  fotoProfil: string;
  tipe: "Ayah" | "Ibu" | "Wali";
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export interface ApiData {
  data: OrtuData[];
  pagination: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
}

export interface OrtuDetailData {
  id: number;
  nama: string;
  nomorHp: string;
  alamat: string;
  jenisKelamin: "L" | "P";
  fotoProfil: string;
  tipe: "Ayah" | "Ibu" | "Wali";
  user: {
    id: number;
    email: string;
    role: string;
  };
  santri: {
    id: number;
    nama: string;
    // nomorHp: string;
    // tingkatan: "Lambat" | "Sedang" | "Cepat";
  }[];
}