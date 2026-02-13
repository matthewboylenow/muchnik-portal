export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full bg-[var(--color-manhattan)]/5 blur-[100px]" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full rounded-full bg-[var(--color-morris-county)]/5 blur-[100px]" />
      </div>
      <div className="relative z-10 w-full max-w-md px-4">{children}</div>
    </div>
  );
}
