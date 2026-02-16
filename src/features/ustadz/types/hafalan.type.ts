export interface SurahProgress {
  id: number;
  nomor: number;
  nama: string;
  namaLatin: string;
  totalAyat: number;
  progress: string;
}

export interface JuzProgress {
  id: number;
  juz: number;
  progress: string;
  totalAyat: number;
}

export interface HafalanProgressApiData {
  message: string;
  status: number;
  mode: 'surah' | 'juz';
  santri: {
    id: number;
    nama: string;
    tahapHafalan: string;
    tingkatan: string;
    totalPoin: number;
  };
  data: SurahProgress[] | JuzProgress[];
}

export type HafalanMode = 'tambah' | 'murajaah';

export interface Ayat {
  id: number;
  nomorAyat: number;
  arab: string;
  latin: string;
  terjemah: string;
  checked: boolean;
  isInitialChecked?: boolean;
  surah?: Surah;
  halaman?: number;
}

export interface Surah {
  id: number;
  nama: string;
  namaLatin: string;
  totalAyat: number;
  nomor: number;
}

export interface HafalanData {
  surah: Surah;
  santriId: number;
  mode: HafalanMode;
  ayat: Ayat[];
}

export interface JuzHafalanData {
  juz: number;
  santriId: number;
  mode: HafalanMode;
  totalSurah: number;
  surah: {
    surah: Surah;
    ayat: Ayat[];
  }[];
}

export interface RiwayatHafalan {
  tanggal: string;
  status: 'TambahHafalan' | 'Murajaah';
  surahId: number;
  namaSurah: string;
  namaSurahLatin: string;
  jumlahAyat: number;
  totalPoin?: number;
  rangeAyat?: {
    awal: number;
    akhir: number;
  };
}

export interface SantriData {
  id: number;
  nama: string;
  ortuId: number;
  tahapHafalan: string;
  tingkatan: string;
  totalPoin: number;
}

export interface PaginationData {
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
}

export interface RiwayatHafalanResponse {
  message: string;
  status: number;
  santri: SantriData;
  pagination: PaginationData;
  data: RiwayatHafalan[];
}

export interface RiwayatDetailData {
  tanggal: string;
  status: 'TambahHafalan' | 'Murajaah';
  surah: Surah;
  ustadz: {
    id: number;
    nama: string;
  };
  catatan: string;
  daftarAyat: Ayat[];
  totalPoin?: number;
}

export interface RiwayatDetailResponse {
  message: string;
  status: number;
  data: RiwayatDetailData;
}

export interface RiwayatHafalanTerakhirResponse {
  status: number;
  message: string;
  pagination: RiwayatHafalanTerakhirPagination;
  data: RiwayatHafalanTerakhirSantri[];
}

export interface RiwayatHafalanTerakhirPagination {
  page: number;
  limit: number;
  totalData: number;
  totalPages: number;
  filter: {
    tahapHafalan?: string;
    status?: 'TambahHafalan' | 'Murajaah';
    name?: string;
  };
}

export interface RiwayatHafalanTerakhirSantri {
  id: number;
  nama: string;
  noInduk: string | null;
  tahapHafalan: string;
  terakhirHafalan: RiwayatHafalanTerakhir | null;
}

export interface RiwayatHafalanTerakhir {
  tanggal: string;
  status: 'TambahHafalan' | 'Murajaah';
  surah: string;
  surahId: number;
  ayatDetail: string;
}

export interface DeleteRiwayatHafalanResponse {
  message: string;
  status: number;
  deletedCount?: number; // hanya ada ketika sukses
}
