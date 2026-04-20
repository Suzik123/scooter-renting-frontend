export default function LoginHeroPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-800 to-emerald-950 items-center justify-center p-12">
      <div className="text-center">
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-4 h-4 rounded-full bg-primary" />
          <span className="text-3xl font-bold text-white">UniScoot</span>
        </div>
        <p className="text-emerald-200 text-lg max-w-sm">
          The smartest way to move around the city. Fast, green, and always at your fingertips.
        </p>
      </div>
    </div>
  );
}
