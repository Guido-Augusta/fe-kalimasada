export interface SantriData {
  id: number;
  userId: number;
  ortuId: number;
  nama: string;
  nomorHp?: string;
  noInduk?: string;
  alamat: string;
  jenisKelamin: string;
  tanggalLahir: string;
  tahapHafalan: "Level1" | "Level2" | "Level3";
  totalPoin: number;
  peringkat: number;
  fotoProfil: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
  orangTua: {
    id: number;
    nama: string;
  }
}

export interface SantriApiPaginationData {
  data: SantriData[];
  pagination: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
  totalSantri: number;
}

export interface SantriDetailData {
  id: number;
  userId: number;
  nama: string;
  nomorHp?: string;
  noInduk?: string;
  alamat: string;
  jenisKelamin: "L" | "P";
  tanggalLahir: string;
  tahapHafalan: "Level1" | "Level2" | "Level3";
  totalPoin: number;
  peringkat: number;
  fotoProfil: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
  orangTua: {
    id: number;
    nama: string;
    tipe: "Ayah" | "Ibu" | "Wali";
  }[];
  waliKelas: {
    id: number;
    nama: string;
  }[]
}
