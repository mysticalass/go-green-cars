import React, { useState } from 'react';
import { PRODUCT_SPECIFICATION } from '../data/specificationData';
import { FileText, Check, Copy, Layers, Database, Cpu, ShieldCheck, Sparkles, BookOpen, ExternalLink, Code } from 'lucide-react';

export const ProductArchitectureView: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState<string>(PRODUCT_SPECIFICATION[0].id);
  const [copied, setCopied] = useState(false);

  const activeSection = PRODUCT_SPECIFICATION.find(s => s.id === activeSectionId) || PRODUCT_SPECIFICATION[0];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Document Header */}
      <div className="bg-[#000B29] text-white p-6 sm:p-8 rounded-2xl border border-blue-900 shadow-md">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold mb-3 border border-blue-400/30">
          <BookOpen className="w-3.5 h-3.5" /> Technical Specification & Product Architecture
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
          "Drive Green, Share Smart" System Architecture & Blueprint
        </h1>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl">
          Complete production-ready technical documentation, database schema (PostgreSQL), RESTful API contracts, telematics IoT pipelines, and Singapore Green Plan alignment.
        </p>
      </div>

      {/* Main Layout: Left Navigation + Right Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-1.5 lg:sticky lg:top-24 h-max">
          <div className="text-xs font-bold text-[#545e77] uppercase tracking-wider px-3 py-2">
            Table of Deliverables (16 Sections)
          </div>

          <div className="space-y-1 max-h-[600px] overflow-y-auto custom-scrollbar">
            {PRODUCT_SPECIFICATION.map(sec => {
              const isActive = sec.id === activeSectionId;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#0034c5] text-white shadow-xs'
                      : 'text-[#434657] hover:bg-[#f3f2ff] hover:text-[#0034c5]'
                  }`}
                >
                  <span className="truncate mr-2">{sec.title}</span>
                  {sec.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#f3f2ff] text-[#0034c5]'
                    }`}>
                      {sec.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-6">
          <div className="border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0034c5]">
                Section Specification
              </span>
              <span className="text-xs text-[#545e77]">ISO 14064 & PDPA Compliant</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#191b25] tracking-tight">
              {activeSection.title}
            </h2>
            <p className="text-sm text-[#545e77] mt-1">{activeSection.summary}</p>
          </div>

          {/* Render section content */}
          <div className="space-y-6">
            {activeSection.content.map((item, idx) => (
              <div key={idx} className="space-y-3">
                {item.heading && (
                  <h3 className="text-base sm:text-lg font-bold text-[#191b25]">
                    {item.heading}
                  </h3>
                )}

                {item.description && (
                  <p className="text-sm text-[#434657] leading-relaxed">
                    {item.description}
                  </p>
                )}

                {item.bullets && (
                  <ul className="space-y-2">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="text-xs sm:text-sm text-[#434657] flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0034c5] mt-2 flex-shrink-0"></span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Render Table */}
                {item.table && (
                  <div className="border border-[#E2E8F0] rounded-xl overflow-hidden mt-3 shadow-xs">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs sm:text-sm">
                        <thead className="bg-[#f3f2ff] font-bold text-[#191b25] border-b border-[#E2E8F0]">
                          <tr>
                            {item.table.headers.map((h, hIdx) => (
                              <th key={hIdx} className="py-3 px-4">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0] text-[#434657]">
                          {item.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-[#fbf8ff]">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="py-3 px-4 font-medium">{cell}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Render Architecture Diagram */}
                {item.architectureDiagram && (
                  <div className="bg-[#0f172a] text-blue-200 p-5 rounded-xl font-mono text-xs overflow-x-auto border border-blue-900 shadow-inner">
                    {item.architectureDiagram.map((line, lIdx) => (
                      <div key={lIdx} className="whitespace-pre">{line}</div>
                    ))}
                  </div>
                )}

                {/* Render Code Snippet */}
                {item.codeSnippet && (
                  <div className="relative mt-3">
                    <div className="bg-[#1e293b] text-emerald-300 p-5 rounded-xl font-mono text-xs overflow-x-auto border border-slate-700 shadow-inner">
                      <pre className="whitespace-pre">{item.codeSnippet}</pre>
                    </div>
                    <button
                      onClick={() => handleCopy(item.codeSnippet || '')}
                      className="absolute top-3 right-3 p-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md text-xs flex items-center gap-1 border border-slate-600 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
