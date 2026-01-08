import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const Unauthorized = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "401 Error: User attempted to access non-existent page:",
      location.pathname
    );
  }, [location.pathname]);

  const handleBack = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-slate-100 border p-12 rounded-lg animate-fade-in shadow-lg">
          <h1 className="text-6xl font-bold mb-4">401</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Oops! Unauthorized
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={handleBack}>Go Back</Button>
            <Button asChild variant="outline">
              <Link to="/login">Return to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Unauthorized;
