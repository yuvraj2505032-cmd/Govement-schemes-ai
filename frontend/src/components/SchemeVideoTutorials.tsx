import React, { useState } from 'react';
import { Play, Youtube } from 'lucide-react';
import { getSchemeVideoIds } from '../data/schemeVideos';

interface SchemeVideoTutorialsProps {
  schemeName: string;
  schemeId?: string;
}

export const SchemeVideoTutorials: React.FC<SchemeVideoTutorialsProps> = ({
  schemeName,
  schemeId,
}) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const videoIds = getSchemeVideoIds(schemeId ?? '');

  return (
    <section className="space-y-3 border-t border-slate-200 pt-4" aria-labelledby="scheme-video-tutorials-title">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 id="scheme-video-tutorials-title" className="text-sm font-bold text-slate-900">
            Video tutorials
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Watch step-by-step application guidance in Hindi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {videoIds.map((videoId, index) => {
          const isPlaying = playingVideoId === videoId;
          const title = `${schemeName} application tutorial${videoIds.length > 1 ? ` ${index + 1}` : ''}`;

          return (
            <article key={videoId} className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="relative aspect-video bg-slate-100">
                {isPlaying ? (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlayingVideoId(videoId)}
                    aria-label={`Play ${title}`}
                    className="group absolute inset-0 flex h-full w-full items-center justify-center bg-slate-900"
                  >
                    <img
                      src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                      alt=""
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover opacity-85 transition group-hover:opacity-70"
                    />
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-rose-600 shadow-md transition group-hover:scale-105">
                      <Play className="ml-0.5 h-5 w-5 fill-current" />
                    </span>
                  </button>
                )}
              </div>
              <div className="flex items-start gap-2.5 p-3">
                <Youtube className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
                <h4 className="text-xs font-semibold leading-relaxed text-slate-800">{title}</h4>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
