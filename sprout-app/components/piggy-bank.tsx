export function PiggyBank({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      {/* Sprout on top */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
        <div className="w-6 h-8 bg-sprout-green rounded-t-full"></div>
        <div className="w-4 h-6 bg-sprout-green rounded-full absolute top-0 -right-2"></div>
      </div>

      {/* Ears */}
      <div className="absolute -top-4 left-8 w-12 h-16 bg-sprout-pink rounded-t-full transform -rotate-12"></div>
      <div className="absolute -top-4 right-8 w-12 h-16 bg-sprout-pink rounded-t-full transform rotate-12"></div>

      {/* Head/Body */}
      <div className="w-48 h-36 bg-sprout-pink rounded-full relative">
        {/* Eyes */}
        <div className="absolute top-12 left-12 w-4 h-4 bg-foreground rounded-full"></div>
        <div className="absolute top-12 right-12 w-4 h-4 bg-foreground rounded-full"></div>

        {/* Snout */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-16 h-12 bg-sprout-pink rounded-full border-4 border-sprout-pink/80">
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-2 h-3 bg-foreground rounded-full"></div>
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-2 h-3 bg-foreground rounded-full"></div>
        </div>

        {/* Coin slots on cheeks */}
        <div className="absolute top-16 left-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">$</span>
        </div>
        <div className="absolute top-16 right-4 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">$</span>
        </div>
      </div>

      {/* Feet */}
      <div className="absolute -bottom-2 left-8 w-8 h-6 bg-sprout-pink rounded-b-lg"></div>
      <div className="absolute -bottom-2 right-8 w-8 h-6 bg-sprout-pink rounded-b-lg"></div>
    </div>
  )
}
