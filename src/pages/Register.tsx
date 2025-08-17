
import RegisterHeader from "@/components/auth/register/RegisterHeader";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <RegisterHeader />
      <RegisterForm />
    </div>
  );
};

export default Register;
