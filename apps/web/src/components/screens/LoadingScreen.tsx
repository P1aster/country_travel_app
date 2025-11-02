export default function LoadingScreen() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex items-center space-x-2" aria-hidden="true">
        <span className="w-3 h-3 bg-red-600 rounded-full animate-bounce [animation-delay:-0.32s]" />
        <span className="w-3 h-3 bg-red-600 rounded-full animate-bounce [animation-delay:-0.16s]" />
        <span className="w-3 h-3 bg-red-600 rounded-full animate-bounce" />
      </div>
    </div>
  );
}
