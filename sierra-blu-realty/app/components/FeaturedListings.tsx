import Image from "next/image";
import Link from "next/link";
import { getProperties } from "@/lib/firestore";
import {
  resolveProperties,
  getPrimaryPropertyImage,
  getPropertyHref,
  formatPropertyPrice,
} from "@/lib/properties";

export default async function FeaturedListings() {
  const displayProperties = resolveProperties(await getProperties()).slice(0, 3);

  return (
    <section id="listings" className="py-32 px-6 relative overflow-hidden bg-[var(--surface)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="ai-badge mb-6 w-fit">AI Recommends</div>
            <h2 className="text-4xl md:text-6xl font-bold font-premium leading-tight">
              A private portfolio for <br/> <span className="text-cyan text-glow-cyan font-light">discerning buyers.</span>
            </h2>
          </div>
          <Link href="/listings" className="text-cyan font-bold uppercase tracking-widest text-xs flex items-center gap-2 group pb-1 border-b border-cyan/20 hover:border-cyan transition-all">
            Explore Portfolio
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayProperties.map((item) => (
            <Link
              key={item.id ?? item.referenceNumber}
              href={getPropertyHref(item)}
              className="glass-card-ai group flex h-full flex-col overflow-hidden"
            >
              <div className="relative h-[320px] w-full overflow-hidden">
                <Image 
                  src={getPrimaryPropertyImage(item)}
                  alt={item.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover brightness-[1.4] transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--background)] via-transparent to-transparent opacity-60" />
                
                {/* Ref tag */}
                <div className="absolute top-6 left-6 ai-badge bg-black/40 border-white/10 text-white/90">
                  {item.referenceNumber}
                </div>

                {/* AI Match Badge */}
                <div className="absolute top-6 right-6 ai-badge !bg-cyan/20 !text-cyan border-cyan/30">
                  98% Match
                </div>
              </div>
              
              <div className="p-8 flex flex-col flex-grow">
                <div className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                  {item.community} {item.subCommunity ? `| ${item.subCommunity}` : ""}
                </div>
                <h3 className="text-2xl font-bold mb-6 group-hover:text-cyan transition-colors line-clamp-1">{item.title}</h3>
                
                {/* Details */}
                <div className="grid grid-cols-3 gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40 mb-8 mt-auto">
                  <div className="flex flex-col gap-1">
                    <span className="text-white">{item.bedrooms} BEDS</span>
                  </div>
                  <div className="flex flex-col gap-1 border-x border-white/5 px-4">
                    <span className="text-white">{item.bathrooms} BATHS</span>
                  </div>
                  <div className="flex flex-col gap-1 text-right">
                    <span className="text-white">{item.size} SQM</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <span className="text-cyan font-bold text-xl tracking-tight">
                    {formatPropertyPrice(item.price)}
                  </span>
                  <div className="btn-ghost-glass !px-6 !py-2 group-hover:!bg-cyan group-hover:!text-black group-hover:!border-cyan transition-all duration-300">
                    Insight
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
