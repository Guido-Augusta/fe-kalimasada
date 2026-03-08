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
  kualitas?: string;
  keterangan?: string;
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

export interface Juz {
  juz: number;
  mulai_dari: {
    surah: {
      nomor: number;
      nama: string;
      nama_latin: string;
    };
    ayat: number;
  } | null;
  progress: string;
  totalAyat: number;
}

export interface ApiResponseProgressSurah {
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

export interface ApiResponseProgressJuz {
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
  data: Juz[];
}

export interface JuzAyat {
  id: number;
  nomorAyat: number;
  arab: string;
  latin: string;
  terjemah: string;
  checked: boolean;
  halaman: number;
  kualitas?: string;
  keterangan?: string;
}

export interface JuzSurahInfo {
  id: number;
  nama: string;
  namaLatin: string;
  totalAyat: number;
  nomor: number;
}

export interface JuzSurahGroup {
  surah: JuzSurahInfo;
  ayat: JuzAyat[];
}

export interface ApiResponseReadJuz {
  juz: number;
  santriId: number;
  mode: string;
  totalSurah: number;
  surah: JuzSurahGroup[];
}