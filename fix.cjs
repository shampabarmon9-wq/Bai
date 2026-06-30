const fs = require('fs');
let content = fs.readFileSync('src/components/ChatBox.tsx', 'utf8');
content = content.replace(
  /<div className=\"w-full max-w-sm aspect-video rounded-xl overflow-hidden relative border border-white\/10 shadow-xl bg-gradient-to-br from-white\/5 to-white\/10 flex flex-col items-center justify-center p-6 mt-2\">\\n<div className=\"absolute inset-0 bg-gradient-to-r from-transparent via-white\/10 to-transparent -translate-x-full animate-\[shimmer_1\.5s_infinite\] w-\[200%\]\"><\/div>\\n<div className=\"relative z-10 w-12 h-12 bg-white\/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm\">\\n<Loader2 className=\"w-6 h-6 text-indigo-400 animate-spin\" \/>\\n<\/div>\\n<div className=\"relative z-10 text-sm font-medium text-indigo-300\/80 tracking-wide animate-pulse text-center\">\\nRendering video\.\.\.\\n<\/div>\\n<\/div>/g,
  `<div className="w-full max-w-sm aspect-video rounded-xl overflow-hidden relative border border-white/10 shadow-xl bg-gradient-to-br from-white/5 to-white/10 flex flex-col items-center justify-center p-6 mt-2">
  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite] w-[200%]"></div>
  <div className="relative z-10 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
    <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
  </div>
  <div className="relative z-10 text-sm font-medium text-indigo-300/80 tracking-wide animate-pulse text-center">
    Rendering video...
  </div>
</div>`
);
fs.writeFileSync('src/components/ChatBox.tsx', content);
