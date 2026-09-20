export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white gap-6">
      <img src="/logo.png" alt="GuettGui" className="h-16 w-auto" />
      <div className="h-8 w-8 rounded-full border-3 border-brand/20 border-t-brand animate-spin" />
    </div>
  );
}
