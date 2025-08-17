
interface LoginHeaderProps {
  message: string;
}

export function LoginHeader({ message }: LoginHeaderProps) {
  return (
    <div className="mb-6 p-4 bg-green-600 border border-green-700 rounded-md text-sm">
      <p className="font-medium text-white mb-1">Already registered?</p>
      <p className="text-white">{message}</p>
    </div>
  );
}
