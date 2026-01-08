import useUser from "@/store/useUser";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { resetAllStores } from "@/utils/resetAllStores";

export const useLogout = () => {
  const navigate = useNavigate();
  const { clearUser } = useUser();

  const logout = () => {
    clearUser();
    resetAllStores();
    localStorage.removeItem("authToken");
    toast.success("Logout berhasil!");
    navigate("/login");
  };

  return logout;
};
