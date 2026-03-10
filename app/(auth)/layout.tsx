export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-slate-950 to-black p-4">
      <div className="mb-8 text-center">

      </div>
      {children}
    </div>
  );
}