import { usePeringkatStore } from "@/store/usePeringkatStore";
import { useRiwayatTerakhirStore } from "@/store/useRiwayatTerakhirStore";
import { useSantriRiwayatStore } from "@/store/useSantriRiwayatStore";
import { useSantriStore } from "@/store/useSantriStore";

export const resetAllStores = () => {
  useSantriRiwayatStore.getState().reset();
  useSantriStore.getState().reset();
  usePeringkatStore.getState().reset();
  useRiwayatTerakhirStore.getState().reset();
};
