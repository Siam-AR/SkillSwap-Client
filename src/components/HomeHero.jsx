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
      
      <div className="relative z-20 mx-auto w-full max-w-7xl 2xl:max-w-[1500px] px-4 sm:px-6 lg:px-12 mt-auto flex flex-col lg:flex-row items-center lg:items-end lg:justify-between gap-12 lg:gap-8">
        
        {/* Left Side: Text and Search */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-6xl 2xl:text-7xl font-black leading-tight tracking-tight text-white mb-6">
            Your Project, Our Talent
          </h1>
          <p className="w-full max-w-2xl xl:max-w-xl 2xl:max-w-2xl text-base md:text-lg xl:text-lg 2xl:text-xl text-slate-200 mb-10">
            Find and hire expert freelancers to bring your projects to life. Explore a variety of services and skills.
          </p>

          <div className="w-full max-w-2xl xl:max-w-xl 2xl:max-w-2xl bg-white rounded-full p-1.5 md:p-2 xl:py-3.5 xl:px-6 shadow-xl flex flex-row items-center gap-1 md:gap-2 border border-slate-200 md:border-none">
            
            {/* Search Input */}
            <div className="flex flex-1 items-center px-3 md:px-4 min-h-[44px]">
              <FiSearch className="h-4 w-4 md:h-5 md:w-5 xl:h-6 xl:w-6 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="Job title or keywords" 
                className="flex-1 w-full bg-transparent px-2 md:px-3 py-2 text-sm xl:text-base text-slate-800 placeholder-slate-400 focus:outline-none min-h-[44px] min-w-0"
              />
            </div>
            
            <div className="hidden md:block w-px h-8 bg-slate-200 shrink-0"></div>
            
            {/* Category Dropdown */}
            <div className="flex items-center px-1 md:px-2 min-h-[44px]">
              <select className="bg-transparent px-1 md:px-3 py-2 text-xs md:text-sm xl:text-base text-slate-600 focus:outline-none cursor-pointer border-none appearance-none md:pr-8 min-h-[44px] max-w-[80px] md:max-w-none text-ellipsis overflow-hidden whitespace-nowrap shrink-0">
                <option value="">Categories</option>
                {categories.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            
            {/* Search Action */}
            <button className="flex items-center justify-center w-11 h-11 md:w-auto md:h-auto md:px-7 md:py-3 xl:px-8 xl:py-3.5 rounded-full bg-[#009689] hover:bg-[#238B81] text-white font-semibold transition-all shrink-0 md:min-h-[44px]">
              <FiSearch className="h-4 w-4 md:hidden" />
              <span className="hidden md:inline text-sm xl:text-base">Search</span>
            </button>
          </div>
        </div>

        {/* Right Side: Categories Grid */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end mt-8 lg:mt-0">
          <p className="text-sm xl:text-base font-medium text-white/80 mb-4 lg:mb-6">Popular Categories</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 xl:gap-5 w-full lg:max-w-md xl:max-w-xl 2xl:max-w-2xl place-items-end">
            {categories.slice(0, 8).map((cat) => (
              <div key={cat.name} className="group flex flex-col items-center justify-center p-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer min-h-[88px] w-full xl:w-28 xl:h-24 2xl:w-32 2xl:h-28">
                <cat.icon className="h-6 w-6 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8 text-white mb-2" />
                <span className="text-center text-xs xl:text-xs 2xl:text-sm font-medium text-white/90 group-hover:text-white line-clamp-1">
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
