export const formatTahapHafalan = (tahap: string) => {
  switch (tahap) {
    case "Level1":
      return "Level 1 - Juz 30";
    case "Level2":
      return "Level 2 - Surat Wajib";
    case "Level3":
      return "Level 3 - Juz 1-29";
    default:
      return "";
  }
};