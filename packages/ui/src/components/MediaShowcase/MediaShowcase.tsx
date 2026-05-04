'use client';

import React from 'react';
import { cn } from '../../lib/cn';

export type MediaShowcaseMediaType = 'video' | 'image' | 'iframe';

export interface MediaShowcaseCaptionTrack {
  src: string;
  /** BCP-47 language tag, e.g. "en", "fr". */
  srcLang: string;
  /** Human-readable label, e.g. "English". */
  label: string;
  default?: boolean;
  kind?: 'subtitles' | 'captions' | 'descriptions' | 'chapters' | 'metadata';
}

export interface MediaShowcaseMedia {
  type: MediaShowcaseMediaType;
  /** Source URL — `<video>` src, image src, or iframe src. */
  src: string;
  /** Poster frame for video. Ignored otherwise. */
  poster?: string;
  /** Alt text for image / accessible name for video. */
  alt?: string;
  /** Caption / subtitle tracks for video. */
  tracks?: MediaShowcaseCaptionTrack[];
  /** Auto-play video on mount. Auto-pauses when scrolled out of view regardless. */
  autoPlay?: boolean;
  /** Loop video. */
  loop?: boolean;
  /** Mute video — required for autoplay in most browsers. */
  muted?: boolean;
}

export type MediaShowcaseAspect = '16/9' | '21/9' | '4/3' | '1/1';

export interface MediaShowcaseProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title'> {
  media: MediaShowcaseMedia;
  /** Eyebrow label rendered above the headline. */
  eyebrow?: React.ReactNode;
  /** Headline overlay. */
  headline?: React.ReactNode;
  /** Supporting copy. */
  description?: React.ReactNode;
  /** Primary CTA — typically a Button. */
  cta?: React.ReactNode;
  /** Show a play-button overlay (only useful for video). When clicked, plays the video. */
  showPlayButton?: boolean;
  /** Aspect ratio of the media container. */
  aspect?: MediaShowcaseAspect;
  /**
   * Apply a dark overlay so overlay text is readable. Default `true` when there
   * is overlay content (headline / description / cta), `false` otherwise.
   */
  overlay?: boolean;
}

const aspectClass: Record<MediaShowcaseAspect, string> = {
  '16/9': 'aspect-[16/9]',
  '21/9': 'aspect-[21/9]',
  '4/3': 'aspect-[4/3]',
  '1/1': 'aspect-square',
};

export const MediaShowcase = React.forwardRef<HTMLElement, MediaShowcaseProps>(
  (
    {
      media,
      eyebrow,
      headline,
      description,
      cta,
      showPlayButton,
      aspect = '16/9',
      overlay,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLElement | null>(null);
    const videoRef = React.useRef<HTMLVideoElement | null>(null);
    const [isPlaying, setIsPlaying] = React.useState(false);

    const setRef = (el: HTMLElement | null) => {
      containerRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLElement | null>).current = el;
    };

    // Auto-pause video when scrolled out of view. IntersectionObserver only —
    // no scroll listeners.
    React.useEffect(() => {
      if (media.type !== 'video') return;
      const node = containerRef.current;
      const video = videoRef.current;
      if (!node || !video) return;
      if (typeof IntersectionObserver === 'undefined') return;

      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
              if (media.autoPlay) {
                void video.play().catch(() => {
                  // Autoplay can fail (no muted, user gesture missing) — swallow silently.
                });
              }
            } else {
              if (!video.paused) video.pause();
            }
          }
        },
        { threshold: [0, 0.25, 0.5, 1] }
      );
      io.observe(node);
      return () => io.disconnect();
    }, [media.type, media.autoPlay, media.src]);

    const onPlayClick = () => {
      const v = videoRef.current;
      if (!v) return;
      void v.play().catch(() => undefined);
    };

    const hasOverlayContent = !!(eyebrow || headline || description || cta);
    const showOverlay = overlay ?? hasOverlayContent;

    return (
      <section
        ref={setRef}
        className={cn(
          'relative w-full overflow-hidden rounded-[20px]',
          'bg-[var(--amp-semantic-bg-sunken)]',
          aspectClass[aspect],
          className
        )}
        {...props}
      >
        {media.type === 'video' && (
          <video
            ref={videoRef}
            src={media.src}
            poster={media.poster}
            autoPlay={media.autoPlay}
            loop={media.loop}
            muted={media.muted ?? media.autoPlay /* autoplay requires muted */}
            playsInline
            preload="metadata"
            aria-label={media.alt}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="absolute inset-0 h-full w-full object-cover"
          >
            {media.tracks?.map((t, i) => (
              <track
                key={i}
                src={t.src}
                srcLang={t.srcLang}
                label={t.label}
                default={t.default}
                kind={t.kind ?? 'captions'}
              />
            ))}
          </video>
        )}
        {media.type === 'image' && (
          <img
            src={media.src}
            alt={media.alt ?? ''}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        )}
        {media.type === 'iframe' && (
          <iframe
            src={media.src}
            title={media.alt ?? 'Embedded media'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        )}

        {showOverlay && (
          <div
            aria-hidden="true"
            className={cn(
              'absolute inset-0 pointer-events-none',
              'bg-gradient-to-t from-black/70 via-black/30 to-black/10'
            )}
          />
        )}

        {showPlayButton && media.type === 'video' && !isPlaying && (
          <button
            type="button"
            onClick={onPlayClick}
            aria-label="Play video"
            className={cn(
              'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
              'inline-flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full',
              'bg-white/90 text-black shadow-lg backdrop-blur-sm',
              'transition-transform hover:scale-110',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2'
            )}
          >
            <svg className="h-7 w-7 md:h-8 md:w-8 ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        )}

        {hasOverlayContent && (
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-6 md:p-10 lg:p-12 text-white">
              <div className="max-w-2xl flex flex-col gap-3">
                {eyebrow && (
                  <span className="inline-flex w-fit items-center px-3 py-1 rounded-full text-[12px] font-semibold uppercase tracking-wide bg-white/20 backdrop-blur-sm">
                    {eyebrow}
                  </span>
                )}
                {headline && (
                  <h2 className="text-[24px] md:text-[36px] lg:text-[44px] font-bold leading-tight tracking-tight">
                    {headline}
                  </h2>
                )}
                {description && (
                  <p className="text-[15px] md:text-[17px] leading-relaxed text-white/85">
                    {description}
                  </p>
                )}
                {cta && <div className="mt-2">{cta}</div>}
              </div>
            </div>
          </div>
        )}
      </section>
    );
  }
);

MediaShowcase.displayName = 'MediaShowcase';
