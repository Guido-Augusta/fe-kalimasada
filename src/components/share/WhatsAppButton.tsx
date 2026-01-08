interface WhatsAppButtonProps {
    phoneNumber: string;
    label?: string;
    className?: string;
}
  
export function WhatsAppButton({
    phoneNumber,
    className = "",
}: WhatsAppButtonProps) {
    if (!phoneNumber) return null;
    const formatted = phoneNumber.replace(/^0/, "62");
  
return (
    <a
        href={`https://wa.me/${formatted}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <button
          className={`flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded ${className}`}
        >
          <img
            src="/icon/WhatsApp.svg"
            className="w-7 h-7"
          />
        </button>
      </a>
    );
} 