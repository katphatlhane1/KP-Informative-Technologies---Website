import React, { useEffect } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { EdTechService } from '../data/kpitData';
import { ResilientImage } from './ResilientImage';
import { KpitLogo } from './KpitLogo';

interface ServiceDetailModalProps {
  service: EdTechService | null;
  onClose: () => void;
  onSelectForProposal: (service: EdTechService) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onSelectForProposal,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (service) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090E]/75 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-service-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-[#D5E4F0] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Ribbon Gradient Bar matching the KP Logo */}
        <div className="h-1.5 w-full kpit-gradient-bg" />

        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-[#1F78B4]">{service.categoryLabel}</span>
                <span aria-hidden="true">·</span>
                <span>Turnaround: {service.turnaroundSla}</span>
                <span aria-hidden="true">·</span>
                <span>Johannesburg Engineering Desk</span>
              </div>
              <h2
                id="modal-service-title"
                className="mt-2 font-display text-2xl font-bold text-[#07090E]"
              >
                {service.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close technical specification dialog"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-[#F4F8FB] hover:text-[#07090E] transition-colors"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {service.imagePath && (
            <div className="mt-6 overflow-hidden rounded-lg border border-[#D5E4F0]">
              <ResilientImage
                src={service.imagePath}
                alt={service.imageAlt || service.title}
                className="h-56 w-full object-cover"
                fallbackTitle={service.title}
                fallbackSubtitle={service.complianceStandards}
                fallbackVariant={service.category === 'hosting' ? 'cloud' : 'lms'}
              />
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div>
              <p className="text-base text-slate-700 leading-relaxed">{service.shortSummary}</p>
              <p className="mt-3 text-xs font-mono-tabular font-semibold text-[#143E68]">
                Benchmark Impact: {service.outcomeMetric} · Standards: {service.complianceStandards}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 border-t border-slate-200 pt-6">
              <div>
                <h3 className="text-sm font-bold text-[#07090E]">
                  Technical Architecture &amp; Capabilities
                </h3>
                <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
                  {service.architectureHighlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#2AA7EA]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#07090E]">
                  Included Institutional Deliverables
                </h3>
                <ul className="mt-3 space-y-2.5 text-sm text-slate-600">
                  {service.deliverables.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-[#1F78B4]"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg bg-[#F4F8FB] p-4 border border-[#D5E4F0]">
              <p className="text-xs font-bold text-[#143E68]">Ideal Institutional Fit</p>
              <p className="mt-1 text-sm text-slate-700">{service.idealFor}</p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-5">
            <div className="flex items-center gap-3">
              <KpitLogo variant="badge" />
              <span className="text-xs text-slate-500 font-mono-tabular">
                011 568 6597 · info@kptechnologies.co.za
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-[#07090E] transition-colors whitespace-nowrap"
              >
                Close Window
              </button>
              <button
                type="button"
                onClick={() => onSelectForProposal(service)}
                className="inline-flex items-center gap-2 rounded-lg kpit-gradient-bg kpit-gradient-bg-hover px-5 py-2.5 text-sm font-semibold text-white transition-all whitespace-nowrap shadow-xs"
              >
                <span>Configure Proposal for {service.categoryLabel}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
