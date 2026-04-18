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

export type HafalanMode = 'tambah' | 'murajaah' | 'tahsin';
export type HafalanStatus = 'TambahHafalan' | 'Murajaah' | 'Tahsin';

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
  kualitas?: string;
  keterangan?: string;
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
  status: HafalanStatus;
  surahId: number;
  namaSurah: string;
  namaSurahLatin: string;
  jumlahAyat: number;
  totalPoin?: number;
  rangeAyat?: {
    awal: number;
    akhir: number;
  };
  juz?: number;
  totalHalaman?: number;
  rangeHalaman?: {
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
  status: HafalanStatus;
  surah: Surah;
  ustadz: {
    id: number;
    nama: string;
  };
  catatan: string;
  daftarAyat: Ayat[];
  totalPoin?: number;
  kualitas?: string;
  keterangan?: string;
}

export interface RiwayatDetailResponse {
  message: string;
  status: number;
  data: RiwayatDetailData;
}

export interface RiwayatHafalanTerakhirResponse {
  status: number;
  message: string;
  mode: 'surah' | 'juz';
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
    status?: HafalanStatus;
    name?: string;
  };
}

export interface RiwayatHafalanTerakhirSantri {
  id: number;
  nama: string;
  tahapHafalan: string;
  terakhirHafalan: RiwayatHafalanTerakhir | null;
}

export interface RiwayatHafalanTerakhir {
  tanggal: string;
  status: HafalanStatus;
  surah?: string;
  surahId?: number;
  ayatDetail?: string;
  juz?: number;
  halamanDetail?: string;
  surahList?: { id: number; namaLatin: string }[];
}

export interface DeleteRiwayatHafalanResponse {
  message: string;
  status: number;
  deletedCount?: number;
}

export interface Juz {
  id: number;
  juz: number;
  nama: string;
}

export interface AyatJuz {
  id: number;
  nomorAyat: number;
  arab: string;
  latin: string;
  terjemah: string;
  halaman: number;
  juz: number;
  surah: Surah;
  poinDidapat: number;
  kualitas?: string;
  keterangan?: string;
}

export interface RiwayatJuzDetailData {
  tanggal: string;
  status: HafalanStatus;
  ustadz: {
    id: number;
    nama: string;
  };
  catatan: string;
  totalPoin: number;
  juz: number;
  rangeAyat: {
    awal: number;
    akhir: number;
  };
  rangeHalaman: {
    awal: number;
    akhir: number;
  };
  surah: Surah[];
  daftarAyat: AyatJuz[];
  kualitas?: string;
  keterangan?: string;
}

export interface RiwayatJuzDetailResponse {
  message: string;
  status: number;
  data: RiwayatJuzDetailData;
}

export interface SaveHafalanResponse {
  message: string;
  status: number;
  kualitas?: string;
  keterangan?: string;
}
