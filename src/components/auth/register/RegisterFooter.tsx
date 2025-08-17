
import { Link } from "react-router-dom";

const RegisterFooter = () => {
  return (
    <p className="text-sm text-center text-muted-foreground">
      Already have an account?{" "}
      <Link to="/login" className="text-[#9b87f5] hover:underline">
        Login
      </Link>
    </p>
  );
};

export default RegisterFooter;
