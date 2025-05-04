export default function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}