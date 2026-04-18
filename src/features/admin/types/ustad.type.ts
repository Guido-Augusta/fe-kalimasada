export interface UstadzData {
  id: number;
  userId: number;
  nama: string;
  nomorHp: string;
  alamat: string;
  jenisKelamin: string;
  fotoProfil: string;
  waliKelasTahap?: "Level1" | "Level2" | "Level3";
  user: {
    id: number;
    email: string;
    role: string;
  };
}

export interface ApiData {
  data: UstadzData[];
  pagination: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
}

export interface UstadzDetailData {
  id: number;
  userId: number;
  nama: string;
  nomorHp: string;
  alamat: string;
  jenisKelamin: "L" | "P";
  fotoProfil: string;
  waliKelasTahap?: "Level1" | "Level2" | "Level3";
  user: {
    id: number;
    email: string;
    role: string;
  };
  santri: {
    id: number;
    nama: string;
    nomorHp: string;
    tahapHafalan?: "Level1" | "Level2" | "Level3";
  }[];
}