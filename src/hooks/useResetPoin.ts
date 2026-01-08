// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { getAuthHeaders } from "@/utils/header";
// import toast from "react-hot-toast";

// const resetPoin = async () => {
//   const headers = getAuthHeaders(false);
//   const url = "http://localhost:5000/api/santri/reset-points";

//   const response = await fetch(url, {
//     method: "PUT",
//     headers,
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Gagal mereset poin.");
//   }

//   return response.json();
// };

// export const useResetPoin = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: resetPoin,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["peringkat"] });
//     },
//   });
// };

// const deductPoin = async (santriId: number, pointsToDeduct: number) => {
//   const headers = getAuthHeaders(true);
//   const url = `http://localhost:5000/api/santri/${santriId}/deduct-points`;

//   const response = await fetch(url, {
//     method: "PUT",
//     headers,
//     body: JSON.stringify({ poin: pointsToDeduct }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     throw new Error(errorData.message || "Gagal mengurangi poin.");
//   }

//   return response.json();
// };

// export const useDeductPoin = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ santriId, pointsToDeduct }: { santriId: number, pointsToDeduct: number }) => deductPoin(santriId, pointsToDeduct),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["peringkat"] });
//       toast.success("Poin berhasil dikurangi.");
//     },
//     onError: (error) => {
//       // toast.error(error.message);
//       toast.error("Gagal mengurangi poin.");
//     },
//   });
// };