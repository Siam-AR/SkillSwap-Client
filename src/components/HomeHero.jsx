import { FiSearch, FiPenTool, FiTrendingUp, FiEdit3, FiVideo, FiCamera, FiMonitor, FiCode, FiDatabase } from "react-icons/fi";

const categories = [
  { name: "Graphic & Design", icon: FiPenTool },
  { name: "Digital Marketing", icon: FiTrendingUp },
  { name: "Writing & Content", icon: FiEdit3 },
  { name: "Video & Editing", icon: FiVideo },
  { name: "Photography", icon: FiCamera },
  { name: "Animation & 3D", icon: FiMonitor },
  { name: "Programming", icon: FiCode },
  { name: "Data Science", icon: FiDatabase },
];

export default function HomeHero() {
  return (
    <section className="relative flex w-full flex-col items-center justify-end overflow-hidden -mt-[80px] min-h-[100dvh] lg:min-h-screen pb-12 lg:pb-16 pt-32">
      <img 
        src="/images/hero-image-1.jpg" 
        alt="Hero Background" 
        className="absolute inset-0 z-0 h-full w-full object-cover object-center" 
      />
      <div className="absolute inset-0 z-10 bg-slate-900/60 lg:bg-slate-900/40 backdrop-brightness-90"></div>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
      
      <div className="relative z-20 mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 mt-auto flex flex-col lg:flex-row items-center lg:items-end lg:justify-between gap-12 lg:gap-8">
        
        {/* Left Side: Text and Search */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6">
            Your Project, Our Talent
          </h1>
          <p className="max-w-2xl text-base text-white/90 md:text-lg mb-10">
            Find and hire expert freelancers to bring your projects to life. Explore a variety of services and skills.
          </p>

          <div className="w-full max-w-2xl bg-white rounded-2xl md:rounded-full p-2 shadow-xl flex flex-col md:flex-row items-center gap-2">
            <div className="flex w-full flex-1 items-center px-4 min-h-[44px]">
              <FiSearch className="h-5 w-5 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Job title or keywords" 
                className="flex-1 w-full bg-transparent px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none min-h-[44px]"
              />
            </div>
            <div className="hidden md:block w-px h-8 bg-slate-200 shrink-0"></div>
            <div className="flex w-full md:w-auto items-center px-2 min-h-[44px]">
              <select className="w-full md:w-auto bg-transparent px-3 py-2 text-sm text-slate-600 focus:outline-none cursor-pointer border-none appearance-none pr-8 min-h-[44px]">
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <button className="w-full md:w-auto px-7 py-3 rounded-xl md:rounded-full bg-[#009689] hover:bg-[#238B81] text-white font-semibold text-sm transition-all shrink-0 min-h-[44px]">
              Search
            </button>
          </div>
        </div>

        {/* Right Side: Categories Grid */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end mt-8 lg:mt-0">
          <p className="text-sm font-medium text-white/80 mb-4 lg:mb-6">Popular Categories</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:max-w-md">
            {categories.slice(0, 8).map((cat) => (
              <div key={cat.name} className="group flex flex-col items-center justify-center p-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer min-h-[88px]">
                <cat.icon className="h-6 w-6 text-white mb-2" />
                <span className="text-center text-xs font-medium text-white/90 group-hover:text-white line-clamp-1">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
