export interface JuzData {
  juz: number;
  startSurah: number;
  startAyah: number;
  endSurah: number;
  endAyah: number;
  startSurahName: string;
  endSurahName: string;
}

export const juzList: JuzData[] = [
  { juz: 1, startSurah: 1, startAyah: 1, endSurah: 2, endAyah: 141, startSurahName: "Al-Fatihah", endSurahName: "Al-Baqarah" },
  { juz: 2, startSurah: 2, startAyah: 142, endSurah: 2, endAyah: 252, startSurahName: "Al-Baqarah", endSurahName: "Al-Baqarah" },
  { juz: 3, startSurah: 2, startAyah: 253, endSurah: 3, endAyah: 92, startSurahName: "Al-Baqarah", endSurahName: "Ali Imran" },
  { juz: 4, startSurah: 3, startAyah: 93, endSurah: 4, endAyah: 23, startSurahName: "Ali Imran", endSurahName: "An-Nisa'" },
  { juz: 5, startSurah: 4, startAyah: 24, endSurah: 4, endAyah: 147, startSurahName: "An-Nisa'", endSurahName: "An-Nisa'" },
  { juz: 6, startSurah: 4, startAyah: 148, endSurah: 5, endAyah: 81, startSurahName: "An-Nisa'", endSurahName: "Al-Ma'idah" },
  { juz: 7, startSurah: 5, startAyah: 82, endSurah: 6, endAyah: 110, startSurahName: "Al-Ma'idah", endSurahName: "Al-An'am" },
  { juz: 8, startSurah: 6, startAyah: 111, endSurah: 7, endAyah: 87, startSurahName: "Al-An'am", endSurahName: "Al-A'raf" },
  { juz: 9, startSurah: 7, startAyah: 88, endSurah: 8, endAyah: 40, startSurahName: "Al-A'raf", endSurahName: "Al-Anfal" },
  { juz: 10, startSurah: 8, startAyah: 41, endSurah: 9, endAyah: 92, startSurahName: "Al-Anfal", endSurahName: "At-Taubah" },
  { juz: 11, startSurah: 9, startAyah: 93, endSurah: 11, endAyah: 5, startSurahName: "At-Taubah", endSurahName: "Hud" },
  { juz: 12, startSurah: 11, startAyah: 6, endSurah: 12, endAyah: 52, startSurahName: "Hud", endSurahName: "Yusuf" },
  { juz: 13, startSurah: 12, startAyah: 53, endSurah: 14, endAyah: 52, startSurahName: "Yusuf", endSurahName: "Ibrahim" },
  { juz: 14, startSurah: 15, startAyah: 1, endSurah: 16, endAyah: 128, startSurahName: "Al-Hijr", endSurahName: "An-Nahl" },
  { juz: 15, startSurah: 17, startAyah: 1, endSurah: 18, endAyah: 74, startSurahName: "Al-Isra'", endSurahName: "Al-Kahf" },
  { juz: 16, startSurah: 18, startAyah: 75, endSurah: 20, endAyah: 135, startSurahName: "Al-Kahf", endSurahName: "Ta Ha" },
  { juz: 17, startSurah: 21, startAyah: 1, endSurah: 22, endAyah: 78, startSurahName: "Al-Anbiya'", endSurahName: "Al-Hajj" },
  { juz: 18, startSurah: 23, startAyah: 1, endSurah: 25, endAyah: 20, startSurahName: "Al-Mu'minun", endSurahName: "Al-Furqan" },
  { juz: 19, startSurah: 25, startAyah: 21, endSurah: 27, endAyah: 55, startSurahName: "Al-Furqan", endSurahName: "An-Naml" },
  { juz: 20, startSurah: 27, startAyah: 56, endSurah: 29, endAyah: 45, startSurahName: "An-Naml", endSurahName: "Al-'Ankabut" },
  { juz: 21, startSurah: 29, startAyah: 46, endSurah: 33, endAyah: 30, startSurahName: "Al-'Ankabut", endSurahName: "Al-Ahzab" },
  { juz: 22, startSurah: 33, startAyah: 31, endSurah: 36, endAyah: 27, startSurahName: "Al-Ahzab", endSurahName: "Ya Sin" },
  { juz: 23, startSurah: 36, startAyah: 28, endSurah: 39, endAyah: 31, startSurahName: "Ya Sin", endSurahName: "Az-Zumar" },
  { juz: 24, startSurah: 39, startAyah: 32, endSurah: 41, endAyah: 46, startSurahName: "Az-Zumar", endSurahName: "Fussilat" },
  { juz: 25, startSurah: 41, startAyah: 47, endSurah: 45, endAyah: 37, startSurahName: "Fussilat", endSurahName: "Al-Jathiyah" },
  { juz: 26, startSurah: 46, startAyah: 1, endSurah: 51, endAyah: 30, startSurahName: "Al-Ahqaf", endSurahName: "Adh-Dhariyat" },
  { juz: 27, startSurah: 51, startAyah: 31, endSurah: 57, endAyah: 29, startSurahName: "Adh-Dhariyat", endSurahName: "Al-Hadid" },
  { juz: 28, startSurah: 58, startAyah: 1, endSurah: 66, endAyah: 12, startSurahName: "Al-Mujadilah", endSurahName: "At-Tahrim" },
  { juz: 29, startSurah: 67, startAyah: 1, endSurah: 77, endAyah: 50, startSurahName: "Al-Mulk", endSurahName: "Al-Mursalat" },
  { juz: 30, startSurah: 78, startAyah: 1, endSurah: 114, endAyah: 6, startSurahName: "An-Naba'", endSurahName: "An-Nas" },
];
