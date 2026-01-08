import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useWizard } from "@/store/useWizard";
import useUser from "@/store/useUser";
import { useNavigate } from "react-router-dom";
import { verifyOldPassword, changePassword } from "@/features/authentication/service/auth.service";
import { verifyPasswordSchema, changePasswordSchema } from "@/features/authentication/validation/auth.validation";

export const useChangePasswordWizard = () => {
  const { step, oldPassword, setStep, setOldPassword, reset } = useWizard();
  const { clearUser } = useUser();
  const navigate = useNavigate();

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const verifyForm = useForm<z.infer<typeof verifyPasswordSchema>>({
    resolver: zodResolver(verifyPasswordSchema),
    defaultValues: { oldPassword: "" },
  });

  const changeForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { newPassword: "" },
  });

  useEffect(() => {
    if (oldPassword) {
      setStep(2);
    }
  }, [oldPassword, setStep]);

  const handleVerify = async (data: z.infer<typeof verifyPasswordSchema>) => {
    const success = await verifyOldPassword(data.oldPassword);
    if (success) {
      setOldPassword(data.oldPassword);
      setStep(2);
    }
  };

  const handleChangePassword = async (data: z.infer<typeof changePasswordSchema>) => {
    if (!oldPassword) {
      return;
    }
    const success = await changePassword(oldPassword, data.newPassword);
    if (success) {
      setShowSuccessModal(true);
    }
  };

  const handleLoginAfterSuccess = () => {
    setShowSuccessModal(false);
    reset();
    clearUser();
    localStorage.removeItem("authToken");
    navigate("/login");
  }

  const cancelChangePassword = () => {
    reset();
  };

  return {
    step,
    verifyForm,
    changeForm,
    handleVerify,
    handleChangePassword,
    cancelChangePassword,
    showSuccessModal,
    handleLoginAfterSuccess,
  };
};