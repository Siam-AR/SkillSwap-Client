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
    <section className="relative flex w-full flex-col items-center justify-end overflow-hidden -mt-[80px] h-screen min-h-[700px] pb-20 lg:pb-28">
      <img 
        src="/images/hero-image-1.jpg" 
        alt="Hero Background" 
        className="absolute inset-0 z-0 h-full w-full object-cover object-center" 
      />
      <div className="absolute inset-0 z-10 bg-slate-900/30 backdrop-brightness-90"></div>
      
      <div className="relative z-20 mx-auto w-full max-w-5xl px-4 text-center mt-auto">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl mb-6">
          Your Project, Our Talent
        </h1>
        <p className="mx-auto max-w-2xl text-base text-white/90 md:text-lg mb-10">
          Find and hire expert freelancers to bring your projects to life. Explore a variety of services and skills.
        </p>

        <div className="mx-auto flex w-full max-w-4xl flex-col sm:flex-row items-center overflow-hidden rounded-2xl sm:rounded-full bg-white shadow-lg p-2 gap-2">
          <div className="flex w-full flex-1 items-center px-4">
            <FiSearch className="h-5 w-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Job title, key words or company" 
              className="w-full bg-transparent px-3 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </div>
          <div className="hidden sm:block h-8 w-[1px] bg-slate-200"></div>
          <div className="flex w-full sm:w-auto items-center px-4">
            <select className="w-full sm:w-auto bg-transparent py-3 text-sm text-slate-600 outline-none cursor-pointer border-none appearance-none pr-8 relative">
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <button className="w-full sm:w-auto rounded-full bg-teal-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal-600 shrink-0">
            Search
          </button>
        </div>

        <div className="mt-16 flex w-full flex-row flex-nowrap items-start justify-start md:justify-center overflow-x-auto whitespace-nowrap gap-4 md:gap-6 lg:gap-8 pb-4">
          {categories.map((cat) => (
            <div key={cat.name} className="group flex shrink-0 cursor-pointer flex-col items-center gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-all group-hover:bg-white/20 group-hover:border-white/50">
                <cat.icon className="h-6 w-6" />
              </div>
              <span className="w-24 shrink-0 text-center text-xs font-medium text-white/80 transition-colors group-hover:text-white">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
