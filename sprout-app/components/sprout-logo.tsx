export function SproutLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2C12 2 8 6 8 10C8 12.2091 9.79086 14 12 14C14.2091 14 16 12.2091 16 10C16 6 12 2 12 2Z"
        fill="currentColor"
      />
      <path d="M12 14V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M15 18C15 18 17 16 19 16C20.1046 16 21 16.8954 21 18C21 19.1046 20.1046 20 19 20C17 20 15 18 15 18Z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  )
}
