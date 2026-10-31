import { Video } from "lucide-react";

export function VideoPitchPlayer({ src, name, durationSec }: { src: string; name: string; durationSec?: number }) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Video className="w-5 h-5 text-indigo-600" />
          Video pitch
        </h2>
        {durationSec ? <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">{durationSec}s</span> : null}
      </div>
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        className="w-full rounded-2xl bg-slate-900 aspect-video"
        aria-label={`${name}'s 60-second video pitch`}
      />
    </section>
  );
}
