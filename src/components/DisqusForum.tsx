import React, { useEffect, useRef } from 'react';
import { MessageSquare, Users, Sparkles, Shield, Zap, MessageCircle } from 'lucide-react';

declare global {
  interface Window {
    DISQUS?: {
      reset: (options: {
        reload: boolean;
        config?: () => void;
      }) => void;
    };
    disqus_config?: () => void;
    DISQUSWIDGETS?: {
      getCount: () => void;
    };
  }
}

interface DisqusForumProps {
  pageUrl?: string;
  pageIdentifier?: string;
}

export const DisqusForum: React.FC<DisqusForumProps> = ({
  pageUrl,
  pageIdentifier = 'go-green-cars-community-forum'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUrl = pageUrl || (typeof window !== 'undefined' ? window.location.href : 'https://go-green-cars.com');
    const currentIdentifier = pageIdentifier;

    // Disqus configuration function
    window.disqus_config = function (this: any) {
      this.page.url = currentUrl;
      this.page.identifier = currentIdentifier;
    };

    if (window.DISQUS) {
      // If Disqus is already loaded on the page, trigger reset with current page config
      try {
        window.DISQUS.reset({
          reload: true,
          config: function (this: any) {
            this.page.url = currentUrl;
            this.page.identifier = currentIdentifier;
          }
        });
      } catch (e) {
        console.warn('Disqus reset error:', e);
      }
    } else {
      // Exact Disqus Universal Embed Script
      const d = document;
      const existingScript = d.querySelector('script[src*="go-green-cars.disqus.com/embed.js"]');
      if (!existingScript) {
        const s = d.createElement('script');
        s.src = 'https://go-green-cars.disqus.com/embed.js';
        s.setAttribute('data-timestamp', String(+new Date()));
        (d.head || d.body).appendChild(s);
      }
    }

    // Refresh comment count script if available
    if (window.DISQUSWIDGETS && typeof window.DISQUSWIDGETS.getCount === 'function') {
      window.DISQUSWIDGETS.getCount();
    }
  }, [pageUrl, pageIdentifier]);

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-10" id="community-discussion">
      <div className="bg-white rounded-3xl border border-[#c4c5da]/60 shadow-sm overflow-hidden">
        {/* Discussion Header */}
        <div className="bg-gradient-to-r from-[#0034c5] via-[#00289b] to-[#001861] p-6 sm:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-blue-100 text-xs font-bold border border-white/20">
                  <Users className="w-3.5 h-3.5 text-blue-200" /> Go Green EV Community
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 backdrop-blur-xs text-emerald-200 text-xs font-bold border border-emerald-400/30">
                  <Zap className="w-3.5 h-3.5 text-emerald-300" /> Live Discussions
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-xs text-indigo-200 text-xs font-bold border border-indigo-400/30">
                  <MessageCircle className="w-3.5 h-3.5 text-indigo-300" />
                  <span className="disqus-comment-count" data-disqus-identifier={pageIdentifier}>
                    Disqus Forum Active
                  </span>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
                <MessageSquare className="w-7 h-7 text-blue-300" />
                Community Discussion Forum
              </h2>
              <p className="text-blue-100/80 text-sm mt-1 max-w-2xl">
                Join the conversation with fellow Singapore EV drivers. Share charging tips, route suggestions, fleet feedback, and eco-mobility experiences.
              </p>
            </div>

            {/* Topics Pill List */}
            <div className="flex flex-wrap md:flex-col items-start md:items-end gap-1.5 text-xs text-blue-200">
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-yellow-300" /> #EVChargingTips
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-300" /> #SingaporeRoadtrips
              </span>
              <span className="bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                <Shield className="w-3 h-3 text-blue-300" /> #GoGreenFleetFeedback
              </span>
            </div>
          </div>
        </div>

        {/* Discussion Forum Container */}
        <div className="p-6 sm:p-8 bg-white min-h-[380px]" ref={containerRef}>
          {/* Required Disqus Thread Div */}
          <div id="disqus_thread" className="w-full"></div>

          {/* Noscript Fallback */}
          <noscript>
            Please enable JavaScript to view the{' '}
            <a href="https://disqus.com/?ref_noscript" className="text-[#0034c5] underline">
              comments powered by Disqus.
            </a>
          </noscript>
        </div>

        {/* Forum Footer Info */}
        <div className="bg-[#fbf8ff] border-t border-[#c4c5da]/40 px-6 py-3.5 flex flex-wrap items-center justify-between text-xs text-[#545e77] gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#191b25]">Powered by Disqus</span>
            <span>•</span>
            <span>Channel: <strong className="text-[#0034c5]">go-green-cars</strong></span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://disqus.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#0034c5] hover:underline font-semibold"
            >
              Disqus Network
            </a>
            <span>•</span>
            <span>Community Guidelines Apply</span>
          </div>
        </div>
      </div>
    </section>
  );
};
