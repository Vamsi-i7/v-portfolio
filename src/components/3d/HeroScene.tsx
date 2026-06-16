export function HeroScene() {
  return (
    <div className="absolute inset-0 w-full h-full select-none pointer-events-none overflow-hidden">
      <iframe 
        src="https://my.spline.design/nexbotrobotcharacterconcept-2LuVKCsetuzZ5yCazQCNMDo4/" 
        className="w-full h-full pointer-events-auto border-0"
        title="Interactive 3D Robot"
        style={{
          background: 'transparent',
          colorScheme: 'dark',
        }}
      />
      {/* Visual patch to cleanly mask the public Spline logo in the bottom-right corner */}
      <div 
        className="absolute bottom-0 right-0 w-[145px] h-[55px] bg-[#0A0A0B] z-10 pointer-events-none"
      />
    </div>
  )
}
