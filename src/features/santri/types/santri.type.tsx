export interface Surah {
  id: number;
  nomor: number;
  nama: string;
  namaLatin: string;
  totalAyat: number;
  progress: string;
}

export interface ApiResponseProgress {
  message: string;
  status: number;
  santri: {
    id: number;
    nama: string;
    ortuId: number;
    tahapHafalan: string;
    tingkatan: string;
    totalPoin: number;
  };
  data: Surah[];
}

export interface Ayat {
  id: number;
  nomorAyat: number;
  arab: string;
  latin: string;
  terjemah: string;
  checked: boolean;
}

export interface SurahInfo {
  id: number;
  nama: string;
  namaLatin: string;
  totalAyat: number;
  nomor: number;
  audio: string;
}

export interface ApiResponseReadSurah {
  surah: SurahInfo;
  santriId: number;
  mode: string;
  ayat: Ayat[];
  audio: string;
}