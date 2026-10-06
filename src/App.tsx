/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Sliders,
  FileText,
  Copy,
  Check,
} from 'lucide-react';
import {
  KPIT_COMPANY_INFO,
  EDTECH_SERVICES,
  CASE_STUDIES,
  WORKING_STEPS,
  PRICING_PACKAGES,
  EdTechService,
  PricingPackage,
} from './data/kpitData';
import { ResilientImage } from './components/ResilientImage';
import { LmsSandboxSection, SandboxConfigPayload } from './components/LmsSandboxSection';
import { ServiceDetailModal } from './components/ServiceDetailModal';
import { KpitLogo } from './components/KpitLogo';

type CapabilityFilter = 'all' | 'lms' | 'hosting' | 'web' | 'marketing';
type BillingMode = 'monthly' | 'turnkey';

interface ConsultationFormState {
  fullName: string;
  email: string;
  phone: string;
  institutionName: string;
  institutionType: string;
  selectedService: string;
  learnerScale: string;
  message: string;
}

interface SubmittedProposalReceipt extends ConsultationFormState {
  referenceCode: string;
  submittedAt: string;
}

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [capabilityFilter, setCapabilityFilter] = useState<CapabilityFilter>('all');
  const [activeModalService, setActiveModalService] = useState<EdTechService | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [billingMode, setBillingMode] = useState<BillingMode>('monthly');

  const [formState, setFormState] = useState<ConsultationFormState>({
    fullName: '',
    email: '',
    phone: '',
    institutionName: '',
    institutionType: 'SETA / QCTO Accredited Training Provider',
    selectedService: '01. Custom Learning Management Systems (LMS)',
    learnerScale: '500 – 3,000 Active Learners',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submittedReceipt, setSubmittedReceipt] = useState<SubmittedProposalReceipt | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [prefillBannerNote, setPrefillBannerNote] = useState<string | null>(null);

  const filteredServices =
    capabilityFilter === 'all'
      ? EDTECH_SERVICES
      : EDTECH_SERVICES.filter((s) => s.category === capabilityFilter);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplySandboxToProposal = (payload: SandboxConfigPayload) => {
    const summaryText = `Sandbox Configuration: ${payload.environmentMode} | ${payload.learners.toLocaleString()} Active Learners | ${payload.concurrentExamUsers.toLocaleString()} Peak Exam Concurrency | ${payload.storageGb} GB NVMe Storage | Recommended: ${payload.recommendedCluster} (Est. R ${payload.estimatedMonthlyZar.toLocaleString()}/mo).`;
    setFormState((prev) => ({
      ...prev,
      selectedService: '01. Custom Learning Management Systems (LMS)',
      learnerScale: `${payload.learners.toLocaleString()} Active Learners (${payload.concurrentExamUsers} Peak Exam Users)`,
      message: prev.message ? `${prev.message}\n\n${summaryText}` : summaryText,
    }));
    setPrefillBannerNote(
      `Loaded LMS Sandbox parameters (${payload.learners.toLocaleString()} learners · R ${payload.estimatedMonthlyZar.toLocaleString()}/mo estimate) into your consultation brief.`
    );
    setSubmittedReceipt(null);
    scrollToSection('contact');
  };

  const handleSelectServiceForProposal = (service: EdTechService) => {
    setActiveModalService(null);
    setFormState((prev) => ({
      ...prev,
      selectedService: service.title,
      message: prev.message
        ? prev.message
        : `We would like a technical consultation and quote for ${service.title} (${service.turnaroundSla}).`,
    }));
    setPrefillBannerNote(`Selected "${service.title}" for your institutional proposal request.`);
    setSubmittedReceipt(null);
    scrollToSection('contact');
  };

  const handleSelectPackageForProposal = (pkg: PricingPackage) => {
    const priceFormatted =
      billingMode === 'monthly'
        ? `R ${pkg.monthlyZar.toLocaleString()}/month Managed LMS & Cloud`
        : `R ${pkg.turnkeyZar.toLocaleString()} Turnkey Build`;
    setFormState((prev) => ({
      ...prev,
      selectedService: `Package: ${pkg.name} (${priceFormatted})`,
      learnerScale: pkg.learnerCapacity,
      message: `Requesting an institutional proposal for the ${pkg.name} tier (${priceFormatted} · ${pkg.learnerCapacity} · ${pkg.concurrentUsers}).`,
    }));
    setPrefillBannerNote(`Loaded "${pkg.name}" (${priceFormatted}) into your proposal form below.`);
    setSubmittedReceipt(null);
    scrollToSection('contact');
  };

  const validateAndSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!formState.fullName.trim() || formState.fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name (at least 2 characters).';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formState.email.trim() || !emailRegex.test(formState.email.trim())) {
      errors.email = 'Please enter a valid institutional or business email address.';
    }
    if (formState.phone.trim()) {
      const phoneClean = formState.phone.replace(/[\s\-()]/g, '');
      if (!/^\+?[0-9]{9,15}$/.test(phoneClean)) {
        errors.phone = 'Please enter a valid South African or international phone number.';
      }
    }
    if (!formState.message.trim() || formState.message.trim().length < 10) {
      errors.message =
        'Please share a brief description of your e-learning or IT requirements (at least 10 characters).';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const refNum = `KPIT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      setSubmittedReceipt({
        ...formState,
        referenceCode: refNum,
        submittedAt: new Date().toLocaleString('en-ZA', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }),
      });
    }
  };

  const handleCopyReceipt = () => {
    if (!submittedReceipt) return;
    const text = `KP Informative Technologies Consultation Reference: ${submittedReceipt.referenceCode}\nName: ${submittedReceipt.fullName}\nEmail: ${submittedReceipt.email}\nService: ${submittedReceipt.selectedService}\nScale: ${submittedReceipt.learnerScale}\nDetails: ${submittedReceipt.message}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 2500);
  };

  return (
    <div className="min-h-screen bg-white text-[#07090E]">
      {/* =====================================================================
          TOP NAVIGATION BAR (3-Zone Contract: Official Logo | 5 Nav Links | CTA)
          Includes 3px signature KP Logo gradient top rule (#143E68 -> #1F78B4 -> #2AA7EA)
      ====================================================================== */}
      <header className="sticky top-0 z-40 border-b border-[#D5E4F0] bg-white/95 backdrop-blur-xs">
        <div className="h-1 w-full kpit-gradient-bg" />
        <div className="mx-auto flex h-18 max-w-[1200px] items-center justify-between px-6 py-2">
          {/* Zone 1: Official KP Informative Technologies Logo */}
          <a
            href="#top"
            aria-label="KP Informative Technologies Home"
            className="inline-flex items-center shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1F78B4]"
          >
            <KpitLogo variant="header" />
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#143E68]"
          >
            <a
              href="#sandbox"
              className="hover:text-[#2AA7EA] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              LMS Sandbox
            </a>
            <a
              href="#capabilities"
              className="hover:text-[#2AA7EA] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Capabilities
            </a>
            <a
              href="#impact"
              className="hover:text-[#2AA7EA] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Impact Proof
            </a>
            <a
              href="#packages"
              className="hover:text-[#2AA7EA] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Packages
            </a>
            <a
              href="#contact"
              className="hover:text-[#2AA7EA] hover:underline underline-offset-4 transition-colors whitespace-nowrap"
            >
              Contact Desk
            </a>
          </nav>

          {/* Zone 3: Primary Action + Mobile Menu Trigger */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => scrollToSection('contact')}
              className="rounded-lg kpit-gradient-bg kpit-gradient-bg-hover px-4 py-2.5 text-xs font-semibold text-white transition-all whitespace-nowrap shrink-0 shadow-xs"
            >
              Schedule Consultation
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="flex md:hidden h-10 w-10 items-center justify-center rounded-lg border border-[#D5E4F0] text-[#143E68] hover:bg-[#F4F8FB] transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="border-b border-[#D5E4F0] bg-white px-6 py-4 md:hidden shadow-lg">
            <nav
              aria-label="Mobile Navigation"
              className="flex flex-col space-y-3 text-sm font-semibold text-[#143E68]"
            >
              <a
                href="#sandbox"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#2AA7EA]"
              >
                LMS Sandbox
              </a>
              <a
                href="#capabilities"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#2AA7EA]"
              >
                Capabilities
              </a>
              <a
                href="#impact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#2AA7EA]"
              >
                Impact Proof
              </a>
              <a
                href="#packages"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#2AA7EA]"
              >
                Packages
              </a>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-[#2AA7EA]"
              >
                About KPIT
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-[#1F78B4] font-bold"
              >
                Contact Desk (011 568 6597)
              </a>
            </nav>
          </div>
        )}
      </header>

      <main id="top">
        {/* =====================================================================
            1. HERO SECTION (Proposition & Dominant Visual Carrier matching Logo Look & Feel)
        ====================================================================== */}
        <section className="mx-auto max-w-[1200px] px-6 pt-12 pb-20 lg:pt-16 lg:pb-24">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Hero Copy Column (7 cols) */}
            <div className="lg:col-span-7">
              {/* Unboxed Regional & Domain Metadata Kicker */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-bold text-[#143E68]">Johannesburg, South Africa</span>
                <span aria-hidden="true">·</span>
                <span className="font-semibold text-[#1F78B4]">
                  Education Technology &amp; LMS Engineering
                </span>
                <span aria-hidden="true">·</span>
                <span>SETA, QCTO, Higher Ed &amp; Corporate L&amp;D</span>
              </div>

              <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-[#07090E] sm:text-5xl lg:text-[52px] lg:leading-[1.12]">
                A Legacy of Innovation,{' '}
                <span className="kpit-gradient-text">A Future of Endless Possibilities</span> in
                Digital Learning.
              </h1>

              <p className="mt-5 max-w-2xl text-base text-slate-600 sm:text-lg leading-relaxed">
                At <strong className="font-bold text-[#07090E]">KP Informative Technologies</strong>
                , we architect custom Learning Management Systems (LMS), high-concurrency exam cloud
                hosting, interactive SCORM courseware, and automated student enrolment portals for
                African educational institutions and forward-thinking enterprises.
              </p>

              {/* Action Bar */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => scrollToSection('contact')}
                  className="inline-flex items-center gap-2.5 rounded-lg kpit-gradient-bg kpit-gradient-bg-hover px-6 py-3.5 text-sm font-semibold text-white transition-all whitespace-nowrap shadow-sm"
                >
                  <span>Request Institutional Proposal</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('sandbox')}
                  className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1F78B4] bg-white px-5 py-3 text-sm font-semibold text-[#143E68] hover:bg-[#F4F8FB] transition-colors whitespace-nowrap"
                >
                  <Sliders className="h-4 w-4 text-[#2AA7EA]" aria-hidden="true" />
                  <span>Simulate LMS &amp; Cloud Capacity</span>
                </button>
              </div>

              {/* Quantified Institutional Benchmarks (Tabular Numerals, Unboxed) */}
              <div className="mt-12 grid grid-cols-3 gap-6 border-t border-[#D5E4F0] pt-8">
                <div>
                  <p className="font-mono-tabular text-2xl font-bold text-[#143E68] sm:text-3xl">
                    99.98%
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Verified exam-week LMS cloud uptime across South Africa
                  </p>
                </div>
                <div>
                  <p className="font-mono-tabular text-2xl font-bold text-[#1F78B4] sm:text-3xl">
                    +184%
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Average learner module completion gain with KPIT mobile LMS
                  </p>
                </div>
                <div>
                  <p className="font-mono-tabular text-2xl font-bold text-[#2AA7EA] sm:text-3xl">
                    24/7
                  </p>
                  <p className="mt-1 text-xs text-slate-600">
                    Direct Johannesburg infrastructure &amp; LMS engineering support
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Visual Carrier Column (5 cols) with KP Geometric Ribbon Accent */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden rounded-xl border-2 border-[#1F78B4]/30 bg-[#0B1F36] shadow-lg">
                {/* Top KP Ribbon Bar */}
                <div className="h-1.5 w-full kpit-gradient-bg" />
                <ResilientImage
                  src="/src/assets/images/hero_edtech_campus_1791288347550.jpg"
                  alt="Students and educators in a sunlit Johannesburg digital learning innovation studio collaborating on interactive LMS tablets and laptops"
                  className="h-[420px] sm:h-[460px] w-full object-cover"
                  fallbackTitle="KP Informative Technologies Digital Campus"
                  fallbackSubtitle="A legacy of innovation, A future of endless possibilities"
                  fallbackVariant="campus"
                />
                {/* Measured Scrim Overlay for WCAG AA Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090E]/95 via-[#143E68]/45 to-transparent" />

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#2AA7EA] font-mono-tabular font-semibold">
                    <span>KPIT EdTech Core</span>
                    <span aria-hidden="true">·</span>
                    <span>POPIA &amp; SCORM Compliant</span>
                    <span aria-hidden="true">·</span>
                    <span>011 568 6597</span>
                  </div>
                  <p className="mt-2 font-sans text-base font-bold italic text-white">
                    “A legacy of innovation, A future of endless possibilities”
                  </p>
                  <p className="mt-1 text-xs text-slate-200">
                    Engineered in Johannesburg for universities, accredited training providers,
                    independent schools, and enterprise academies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            2. TWO-ZONE INTERACTIVE LMS & CLOUD CAPACITY SANDBOX
        ====================================================================== */}
        <LmsSandboxSection onApplyToProposal={handleApplySandboxToProposal} />

        {/* =====================================================================
            3. CORE EDTECH CAPABILITIES (Asymmetric Bento Grid + Filter Bar)
        ====================================================================== */}
        <section
          id="capabilities"
          aria-labelledby="capabilities-heading"
          className="bg-white py-20"
        >
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="text-xs text-slate-500">
                  <span className="font-bold text-[#143E68]">
                    Specialized EdTech &amp; ICT Engineering
                  </span>
                  <span aria-hidden="true"> · </span>
                  <span>End-to-End Institutional Delivery</span>
                </p>
                <h2
                  id="capabilities-heading"
                  className="mt-2 font-display text-3xl font-bold tracking-tight text-[#07090E] sm:text-4xl"
                >
                  Proven Solutions to Expand Your Educational Institution &amp; Digital Reach
                </h2>
                <p className="mt-3 text-base text-slate-600">
                  Technology should be smart, reliable, and accessible. Explore our five core
                  capabilities engineered for modern learning environments and high-growth
                  organizations.
                </p>
              </div>

              {/* Interactive Filter Controls */}
              <div
                role="group"
                aria-label="Filter capabilities by domain"
                className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-1"
              >
                {(
                  [
                    { id: 'all', label: 'All Capabilities (5)' },
                    { id: 'lms', label: 'LMS & Courseware' },
                    { id: 'hosting', label: 'Cloud Hosting' },
                    { id: 'web', label: 'Campus Web & SIS' },
                    { id: 'marketing', label: 'Enrolment Growth' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setCapabilityFilter(tab.id)}
                    className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all whitespace-nowrap ${
                      capabilityFilter === tab.id
                        ? 'kpit-gradient-bg text-white shadow-xs'
                        : 'text-slate-600 hover:text-[#07090E]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Asymmetric Bento Grid */}
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {filteredServices.map((service) => (
                <article
                  key={service.id}
                  className={`${
                    capabilityFilter === 'all' ? service.spanClass : 'lg:col-span-1'
                  } flex flex-col justify-between rounded-xl border border-[#D5E4F0] bg-[#F4F8FB]/60 p-6 sm:p-8 transition-colors hover:border-[#2AA7EA] hover:bg-white`}
                >
                  <div>
                    {/* Quiet 1-line unboxed metadata kicker */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-[#1F78B4]">{service.categoryLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>SLA: {service.turnaroundSla}</span>
                    </div>

                    <h3 className="mt-2.5 font-display text-xl font-bold text-[#07090E] sm:text-2xl">
                      {service.title}
                    </h3>

                    <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                      {service.shortSummary}
                    </p>

                    {service.imagePath && (
                      <div className="mt-5 overflow-hidden rounded-lg border border-[#D5E4F0]">
                        <ResilientImage
                          src={service.imagePath}
                          alt={service.imageAlt || service.title}
                          className="h-48 w-full object-cover"
                          fallbackTitle={service.title}
                          fallbackSubtitle={service.complianceStandards}
                          fallbackVariant={service.category === 'hosting' ? 'cloud' : 'lms'}
                        />
                      </div>
                    )}

                    <ul className="mt-5 space-y-2 border-t border-[#D5E4F0] pt-4 text-xs text-slate-700">
                      {service.deliverables.slice(0, 3).map((deliv, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2
                            className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1F78B4]"
                            aria-hidden="true"
                          />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 border-t border-[#D5E4F0] pt-4">
                    <p className="font-mono-tabular text-xs text-slate-500">
                      {service.complianceStandards}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveModalService(service)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#143E68] hover:text-[#2AA7EA] hover:underline underline-offset-4 whitespace-nowrap"
                      >
                        <FileText className="h-3.5 w-3.5 text-[#1F78B4]" aria-hidden="true" />
                        <span>Inspect Technical Specification</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSelectServiceForProposal(service)}
                        className="rounded-lg border border-[#1F78B4]/30 bg-white px-3.5 py-2 text-xs font-semibold text-[#143E68] hover:bg-[#143E68] hover:text-white transition-colors whitespace-nowrap"
                      >
                        Configure Service
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            4. PROOF OF IMPACT / CASE STUDIES & 4-STEP WORKING PROCESS
        ====================================================================== */}
        <section
          id="impact"
          aria-labelledby="impact-heading"
          className="border-y border-[#D5E4F0] bg-[#F4F8FB] py-20"
        >
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="max-w-2xl">
              <p className="text-xs text-slate-500">
                <span className="font-bold text-[#143E68]">Verified Institutional Outcomes</span>
                <span aria-hidden="true"> · </span>
                <span>South African EdTech Deployments</span>
              </p>
              <h2
                id="impact-heading"
                className="mt-2 font-display text-3xl font-bold tracking-tight text-[#07090E] sm:text-4xl"
              >
                Long-Term Partnerships &amp; Quantified Educational Impact
              </h2>
              <p className="mt-3 text-base text-slate-600">
                We collaborate with accredited training providers, higher education colleges, and
                corporate academies across South Africa and internationally to deliver measurable
                learner and operational outcomes.
              </p>
            </div>

            {/* 3 Case Study Cards */}
            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {CASE_STUDIES.map((study) => (
                <article
                  key={study.id}
                  className="flex flex-col justify-between rounded-xl border border-[#D5E4F0] bg-white p-6 sm:p-7"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-[#1F78B4]">{study.sector}</span>
                      <span aria-hidden="true">·</span>
                      <span>{study.location}</span>
                    </div>

                    <p className="mt-3 font-mono-tabular text-2xl font-bold text-[#143E68]">
                      {study.headlineMetric}
                    </p>
                    <p className="mt-1 font-mono-tabular text-xs text-slate-600">
                      {study.secondaryMetric} · {study.timeframe}
                    </p>

                    <h3 className="mt-4 text-lg font-bold text-[#07090E]">{study.institution}</h3>

                    <div className="mt-3 space-y-2 text-xs text-slate-600 leading-relaxed">
                      <p>
                        <strong className="font-semibold text-[#07090E]">Before: </strong>
                        {study.challenge}
                      </p>
                      <p>
                        <strong className="font-semibold text-[#143E68]">
                          KPIT Intervention:{' '}
                        </strong>
                        {study.solution}
                      </p>
                    </div>
                  </div>

                  <blockquote className="mt-6 border-t border-slate-200 pt-4">
                    <p className="text-xs italic text-slate-700 leading-relaxed">
                      “{study.outcomeQuote}”
                    </p>
                    <footer className="mt-3 text-xs text-slate-500">
                      <strong className="font-bold text-[#07090E]">{study.spokespersonName}</strong>
                      <span> · {study.spokespersonRole}</span>
                    </footer>
                  </blockquote>
                </article>
              ))}
            </div>

            {/* KPIT 4-Step Working Process */}
            <div className="mt-16 border-t border-[#D5E4F0] pt-16">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                <div>
                  <p className="text-xs text-slate-500">
                    <span className="font-bold text-[#143E68]">Working Steps</span>
                    <span aria-hidden="true"> · </span>
                    <span>Structured 4-Stage Institutional Delivery</span>
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-bold text-[#07090E] sm:text-3xl">
                    Four Clear Steps From Initial Audit to Production Launch
                  </h3>
                </div>
                <p className="text-xs font-mono-tabular text-slate-500">
                  Select any stage below to inspect deliverables &amp; turnaround SLA
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
                {WORKING_STEPS.map((step, index) => {
                  const isActive = activeStepIndex === index;
                  return (
                    <button
                      key={step.stepNumber}
                      type="button"
                      onClick={() => setActiveStepIndex(index)}
                      className={`flex flex-col justify-between rounded-xl border p-5 text-left transition-all ${
                        isActive
                          ? 'border-2 border-[#1F78B4] bg-white shadow-xs'
                          : 'border-[#D5E4F0] bg-white/70 hover:bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs font-mono-tabular">
                          <span className="font-bold text-[#1F78B4]">Stage {step.stepNumber}</span>
                          <span className="text-slate-500">{step.duration}</span>
                        </div>
                        <h4 className="mt-2 text-base font-bold text-[#07090E]">{step.title}</h4>
                        <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                      <div className="mt-4 border-t border-slate-200/80 pt-3 text-xs font-mono-tabular text-slate-700">
                        <span className="text-slate-400 block">Stage Output:</span>
                        <span className="font-semibold text-[#143E68]">
                          {step.deliverableOutput}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            5. TRANSPARENT EDTECH PACKAGES & DEPLOYMENT MODELS
        ====================================================================== */}
        <section id="packages" aria-labelledby="packages-heading" className="bg-white py-20">
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="text-xs text-slate-500">
                  <span className="font-bold text-[#143E68]">
                    Transparent South African EdTech Investment
                  </span>
                  <span aria-hidden="true"> · </span>
                  <span>Predictable SLA Tiers</span>
                </p>
                <h2
                  id="packages-heading"
                  className="mt-2 font-display text-3xl font-bold tracking-tight text-[#07090E] sm:text-4xl"
                >
                  Right-Sized LMS &amp; Digital Campus Packages
                </h2>
                <p className="mt-3 text-base text-slate-600">
                  Choose between fully managed monthly LMS cloud hosting or a turnkey custom
                  platform build with complete institutional ownership.
                </p>
              </div>

              {/* Interactive Billing Mode Switcher */}
              <div
                role="group"
                aria-label="Select pricing deployment model"
                className="inline-flex items-center gap-1 rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-1"
              >
                <button
                  type="button"
                  onClick={() => setBillingMode('monthly')}
                  className={`rounded-md px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                    billingMode === 'monthly'
                      ? 'kpit-gradient-bg text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#07090E]'
                  }`}
                >
                  Monthly Managed LMS + Cloud
                </button>
                <button
                  type="button"
                  onClick={() => setBillingMode('turnkey')}
                  className={`rounded-md px-4 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                    billingMode === 'turnkey'
                      ? 'kpit-gradient-bg text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#07090E]'
                  }`}
                >
                  Turnkey Custom Platform Build
                </button>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
              {PRICING_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative flex flex-col justify-between overflow-hidden rounded-xl border p-6 sm:p-8 ${
                    pkg.featured
                      ? 'border-2 border-[#1F78B4] bg-white shadow-md'
                      : 'border-[#D5E4F0] bg-[#F4F8FB]/50'
                  }`}
                >
                  {pkg.featured && <div className="absolute inset-x-0 top-0 h-1.5 kpit-gradient-bg" />}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{pkg.learnerCapacity}</span>
                      {pkg.featured && (
                        <span className="font-bold text-[#1F78B4]">
                          Most Selected by Accredited Colleges
                        </span>
                      )}
                    </div>

                    <h3 className="mt-2 font-display text-2xl font-bold text-[#07090E]">
                      {pkg.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {pkg.targetAudience}
                    </p>

                    <div className="mt-6 border-y border-[#D5E4F0] py-5 font-mono-tabular">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#143E68]">
                          R{' '}
                          {(billingMode === 'monthly'
                            ? pkg.monthlyZar
                            : pkg.turnkeyZar
                          ).toLocaleString()}
                        </span>
                        <span className="text-xs text-slate-500">
                          {billingMode === 'monthly'
                            ? '/ month (Managed SLA)'
                            : 'once-off turnkey deployment'}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-slate-600">
                        {pkg.concurrentUsers} · {pkg.storageIncluded}
                      </p>
                    </div>

                    <ul className="mt-6 space-y-3 text-xs text-slate-700">
                      {pkg.includedFeatures.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2
                            className="mt-0.5 h-4 w-4 shrink-0 text-[#1F78B4]"
                            aria-hidden="true"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-200/80">
                    <p className="text-xs font-mono-tabular text-slate-500 mb-4">
                      {pkg.slaGuarantee}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleSelectPackageForProposal(pkg)}
                      className={`w-full rounded-lg px-4 py-3 text-xs font-semibold transition-all whitespace-nowrap ${
                        pkg.featured
                          ? 'kpit-gradient-bg kpit-gradient-bg-hover text-white shadow-xs'
                          : 'border border-[#143E68] bg-white text-[#143E68] hover:bg-[#143E68] hover:text-white'
                      }`}
                    >
                      Select {pkg.name} for Proposal
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =====================================================================
            6. ABOUT KP INFORMATIVE TECHNOLOGIES (Mission, Vision, Values & Brand)
        ====================================================================== */}
        <section
          id="about"
          aria-labelledby="about-heading"
          className="border-t border-[#D5E4F0] bg-[#F4F8FB] py-20"
        >
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-6">
                <p className="text-xs text-slate-500">
                  <span className="font-bold text-[#143E68]">
                    About KP Informative Technologies (KPIT)
                  </span>
                  <span aria-hidden="true"> · </span>
                  <span>Established 2021 in Johannesburg</span>
                </p>
                <h2
                  id="about-heading"
                  className="mt-2 font-display text-3xl font-bold tracking-tight text-[#07090E] sm:text-4xl"
                >
                  Smart, Reliable &amp; Accessible Technology Built for Learning and Growth
                </h2>
                <p className="mt-4 text-sm text-slate-600 leading-relaxed">
                  Founded with a passion for technology and educational excellence in Johannesburg,{' '}
                  <strong className="font-bold text-[#07090E]">KP Informative Technologies</strong>{' '}
                  combines instructional design sensibility, cloud systems engineering, and
                  strategic digital marketing to help institutions and businesses thrive in a
                  fast-changing digital world.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 border-t border-[#D5E4F0] pt-6">
                  <div>
                    <h3 className="text-sm font-bold text-[#143E68]">Our Mission</h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {KPIT_COMPANY_INFO.mission}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#1F78B4]">Our Vision</h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                      {KPIT_COMPANY_INFO.vision}
                    </p>
                  </div>
                </div>

                {/* 5 Core Values */}
                <div className="mt-8 border-t border-[#D5E4F0] pt-6">
                  <h3 className="text-xs font-bold text-[#07090E]">
                    Core Institutional Principles
                  </h3>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {KPIT_COMPANY_INFO.values.map((val, idx) => (
                      <div key={val.title} className="text-xs">
                        <p className="font-bold text-[#143E68]">
                          0{idx + 1}. {val.title}
                        </p>
                        <p className="mt-1 text-slate-600 leading-relaxed">{val.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="overflow-hidden rounded-xl border border-[#D5E4F0] bg-white shadow-sm">
                  <div className="h-1.5 w-full kpit-gradient-bg" />
                  <ResilientImage
                    src="/src/assets/images/collaborative_workshop_team_1791288380494.jpg"
                    alt="KP Informative Technologies software engineers and instructional systems specialists collaborating in Johannesburg"
                    className="h-[360px] sm:h-[400px] w-full object-cover"
                    fallbackTitle="Johannesburg Engineering & Instructional Design Studio"
                    fallbackSubtitle="Collaborative digital transformation for African institutions"
                    fallbackVariant="team"
                  />
                  <div className="bg-white p-6 border-t border-[#D5E4F0]">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <KpitLogo variant="badge" />
                      <span className="text-xs font-mono-tabular font-semibold text-[#143E68]">
                        Johannesburg · Local &amp; International Delivery
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                      Whether you are an accredited training academy launching your first online
                      qualification or a multi-campus institution migrating thousands of students to
                      high-availability cloud infrastructure, KPIT is your dedicated technical
                      partner.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================================
            7. INTERACTIVE CONSULTATION & PROPOSAL CAPTURE DESK (#contact)
        ====================================================================== */}
        <section
          id="contact"
          aria-labelledby="contact-heading"
          className="border-t border-[#D5E4F0] bg-white py-20"
        >
          <div className="mx-auto max-w-[1200px] px-6">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
              {/* Left Column: Direct Contact Info (5 cols) */}
              <div className="lg:col-span-5">
                <p className="text-xs text-slate-500">
                  <span className="font-bold text-[#143E68]">
                    Direct Johannesburg Consultation Desk
                  </span>
                  <span aria-hidden="true"> · </span>
                  <span>Response Within 4 Business Hours</span>
                </p>
                <h2
                  id="contact-heading"
                  className="mt-2 font-display text-3xl font-bold tracking-tight text-[#07090E] sm:text-4xl"
                >
                  Grow Your Institution With Our EdTech Expertise
                </h2>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                  Speak directly with our solutions architects in Johannesburg to scope your
                  Learning Management System, migrate your campus hosting, or launch your student
                  enrolment portal.
                </p>

                <div className="mt-8 space-y-5 rounded-xl border border-[#D5E4F0] bg-[#F4F8FB] p-6">
                  <div className="flex items-start gap-3.5">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#1F78B4]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-[#07090E]">Office Address</p>
                      <p className="mt-0.5 text-sm text-slate-600">
                        Johannesburg, Gauteng, South Africa
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 border-t border-[#D5E4F0] pt-4">
                    <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#1F78B4]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-[#07090E]">Telephone Numbers</p>
                      <div className="mt-1 space-y-1 font-mono-tabular text-sm text-[#143E68] font-semibold">
                        <a
                          href="tel:+27115686597"
                          className="block hover:text-[#2AA7EA] hover:underline"
                        >
                          +27 11 568-6597 (011 568 6597)
                        </a>
                        <a
                          href="tel:+27672156028"
                          className="block hover:text-[#2AA7EA] hover:underline"
                        >
                          +27 67 215-6028
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 border-t border-[#D5E4F0] pt-4">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#1F78B4]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-[#07090E]">Official Email Desks</p>
                      <div className="mt-1 space-y-1 font-mono-tabular text-sm text-[#143E68] font-semibold">
                        <a
                          href="mailto:info@kptechnologies.co.za"
                          className="block hover:text-[#2AA7EA] hover:underline"
                        >
                          info@kptechnologies.co.za
                        </a>
                        <a
                          href="mailto:support@kptechnologies.co.za"
                          className="block hover:text-[#2AA7EA] hover:underline"
                        >
                          support@kptechnologies.co.za
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 border-t border-[#D5E4F0] pt-4">
                    <Clock className="mt-0.5 h-5 w-5 shrink-0 text-[#1F78B4]" aria-hidden="true" />
                    <div>
                      <p className="text-xs font-bold text-[#07090E]">Operating Hours</p>
                      <p className="mt-0.5 text-xs text-slate-600">{KPIT_COMPANY_INFO.hours}</p>
                      <p className="mt-1 text-xs text-[#059669] font-semibold">
                        ● 24/7 Emergency Cloud &amp; LMS Uptime Standby for SLA Clients
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Validated Consultation & Proposal Form (7 cols) */}
              <div className="lg:col-span-7">
                <div className="overflow-hidden rounded-xl border border-[#D5E4F0] bg-white shadow-xs">
                  <div className="h-1.5 w-full kpit-gradient-bg" />
                  <div className="p-6 sm:p-8">
                    {prefillBannerNote && !submittedReceipt && (
                      <div className="mb-6 flex items-center justify-between gap-3 rounded-lg border border-[#2AA7EA]/40 bg-[#F4F8FB] px-4 py-3 text-xs text-[#143E68]">
                        <span className="font-semibold">{prefillBannerNote}</span>
                        <button
                          type="button"
                          onClick={() => setPrefillBannerNote(null)}
                          aria-label="Dismiss prefill notification"
                          className="text-slate-500 hover:text-[#07090E] font-bold whitespace-nowrap"
                        >
                          Dismiss
                        </button>
                      </div>
                    )}

                    {submittedReceipt ? (
                      <div role="status" aria-live="polite" className="space-y-6 py-4">
                        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                          <div className="flex items-center gap-3">
                            <CheckCircle2
                              className="h-8 w-8 shrink-0 text-[#059669]"
                              aria-hidden="true"
                            />
                            <div>
                              <p className="text-xs font-mono-tabular text-[#059669] font-bold">
                                ● CONSULTATION &amp; PROPOSAL BRIEF REGISTERED
                              </p>
                              <h3 className="font-display text-2xl font-bold text-[#07090E]">
                                Thank You, {submittedReceipt.fullName}
                              </h3>
                            </div>
                          </div>
                          <KpitLogo variant="badge" />
                        </div>

                        <p className="text-sm text-slate-600">
                          Your institutional inquiry has been assigned reference code{' '}
                          <strong className="font-mono-tabular font-bold text-[#143E68]">
                            {submittedReceipt.referenceCode}
                          </strong>
                          . A KP Informative Technologies solutions architect in Johannesburg will
                          contact you at{' '}
                          <strong className="text-[#07090E]">{submittedReceipt.email}</strong> within
                          4 business hours.
                        </p>

                        <div className="rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-4 font-mono-tabular text-xs space-y-2 text-slate-700">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Reference Code:</span>
                            <span className="font-bold text-[#143E68]">
                              {submittedReceipt.referenceCode}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Timestamp:</span>
                            <span>{submittedReceipt.submittedAt}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Institution / Organization:</span>
                            <span>
                              {submittedReceipt.institutionName || submittedReceipt.institutionType}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Selected Capability:</span>
                            <span className="font-bold text-[#1F78B4]">
                              {submittedReceipt.selectedService}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Learner Scale:</span>
                            <span>{submittedReceipt.learnerScale}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          <button
                            type="button"
                            onClick={handleCopyReceipt}
                            className="inline-flex items-center gap-2 rounded-lg border border-[#D5E4F0] bg-white px-4 py-2.5 text-xs font-semibold text-[#143E68] hover:bg-[#F4F8FB] transition-colors whitespace-nowrap"
                          >
                            {copiedReceipt ? (
                              <>
                                <Check className="h-4 w-4 text-[#059669]" aria-hidden="true" />
                                <span>Copied Reference Summary</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4" aria-hidden="true" />
                                <span>Copy Proposal Summary</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setSubmittedReceipt(null)}
                            className="text-xs font-bold text-[#1F78B4] hover:underline whitespace-nowrap"
                          >
                            Submit Another Inquiry
                          </button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={validateAndSubmitForm} noValidate className="space-y-5">
                        <div>
                          <h3 className="font-display text-xl font-bold text-[#07090E]">
                            Request an EdTech Architecture Consultation or Quote
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            Complete the brief below to receive a tailored technical specification
                            and ZAR cost breakdown.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="input-fullname"
                              className="block text-xs font-bold text-[#07090E]"
                            >
                              Full Name <span className="text-[#DC2626]">*</span>
                            </label>
                            <input
                              id="input-fullname"
                              type="text"
                              required
                              placeholder="e.g. Dr. Lerato Khumalo"
                              value={formState.fullName}
                              onChange={(e) =>
                                setFormState((s) => ({ ...s, fullName: e.target.value }))
                              }
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#07090E] placeholder:text-slate-400 focus:border-[#1F78B4] focus:outline-none"
                            />
                            {formErrors.fullName && (
                              <p className="mt-1 text-xs text-[#DC2626]">{formErrors.fullName}</p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="input-email"
                              className="block text-xs font-bold text-[#07090E]"
                            >
                              Institutional or Work Email <span className="text-[#DC2626]">*</span>
                            </label>
                            <input
                              id="input-email"
                              type="email"
                              required
                              placeholder="l.khumalo@academy.ac.za"
                              value={formState.email}
                              onChange={(e) =>
                                setFormState((s) => ({ ...s, email: e.target.value }))
                              }
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#07090E] placeholder:text-slate-400 focus:border-[#1F78B4] focus:outline-none"
                            />
                            {formErrors.email && (
                              <p className="mt-1 text-xs text-[#DC2626]">{formErrors.email}</p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="input-phone"
                              className="block text-xs font-bold text-[#07090E]"
                            >
                              Telephone / Mobile (Optional)
                            </label>
                            <input
                              id="input-phone"
                              type="tel"
                              placeholder="+27 82 000 0000"
                              value={formState.phone}
                              onChange={(e) =>
                                setFormState((s) => ({ ...s, phone: e.target.value }))
                              }
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#07090E] placeholder:text-slate-400 focus:border-[#1F78B4] focus:outline-none"
                            />
                            {formErrors.phone && (
                              <p className="mt-1 text-xs text-[#DC2626]">{formErrors.phone}</p>
                            )}
                          </div>

                          <div>
                            <label
                              htmlFor="input-institution"
                              className="block text-xs font-bold text-[#07090E]"
                            >
                              Institution or Company Name
                            </label>
                            <input
                              id="input-institution"
                              type="text"
                              placeholder="e.g. Gauteng Technical College"
                              value={formState.institutionName}
                              onChange={(e) =>
                                setFormState((s) => ({ ...s, institutionName: e.target.value }))
                              }
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#07090E] placeholder:text-slate-400 focus:border-[#1F78B4] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                          <div>
                            <label
                              htmlFor="select-service"
                              className="block text-xs font-bold text-[#07090E]"
                            >
                              Primary EdTech / IT Service Required
                            </label>
                            <select
                              id="select-service"
                              value={formState.selectedService}
                              onChange={(e) =>
                                setFormState((s) => ({ ...s, selectedService: e.target.value }))
                              }
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#07090E] focus:border-[#1F78B4] focus:outline-none"
                            >
                              <option value="01. Custom Learning Management Systems (LMS)">
                                01. Custom Learning Management Systems (LMS)
                              </option>
                              <option value="02. High-Concurrency LMS & Campus Cloud Hosting">
                                02. High-Concurrency LMS &amp; Campus Cloud Hosting
                              </option>
                              <option value="03. Institutional Web Portals & Student Enrolment Systems">
                                03. Institutional Web Portals &amp; Student Enrolment Systems
                              </option>
                              <option value="04. Interactive Courseware & Educational Software Engineering">
                                04. Interactive Courseware &amp; Educational Software Engineering
                              </option>
                              <option value="05. Student Enrolment Digital Marketing & Academic SEO">
                                05. Student Enrolment Digital Marketing &amp; Academic SEO
                              </option>
                              <option value="Package: Starter Training Academy (R 4,850/month Managed LMS & Cloud)">
                                Package: Starter Training Academy
                              </option>
                              <option value="Package: Accredited Institution & TVET Suite (R 9,600/month Managed LMS & Cloud)">
                                Package: Accredited Institution &amp; TVET Suite
                              </option>
                              <option value="Package: Enterprise Campus & University Cloud (R 21,500/month Managed LMS & Cloud)">
                                Package: Enterprise Campus &amp; University Cloud
                              </option>
                            </select>
                          </div>

                          <div>
                            <label
                              htmlFor="select-institution-type"
                              className="block text-xs font-bold text-[#07090E]"
                            >
                              Organization Sector
                            </label>
                            <select
                              id="select-institution-type"
                              value={formState.institutionType}
                              onChange={(e) =>
                                setFormState((s) => ({ ...s, institutionType: e.target.value }))
                              }
                              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#07090E] focus:border-[#1F78B4] focus:outline-none"
                            >
                              <option value="SETA / QCTO Accredited Training Provider">
                                SETA / QCTO Accredited Training Provider
                              </option>
                              <option value="University / Private Higher Education">
                                University / Private Higher Education
                              </option>
                              <option value="TVET / Vocational College">
                                TVET / Vocational College
                              </option>
                              <option value="K-12 Independent School / Academy">
                                K-12 Independent School / Academy
                              </option>
                              <option value="Corporate L&D / Enterprise Training">
                                Corporate L&amp;D / Enterprise Training
                              </option>
                              <option value="Growing Startup / SME Digital Transformation">
                                Growing Startup / SME Digital Transformation
                              </option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="textarea-message"
                            className="block text-xs font-bold text-[#07090E]"
                          >
                            Project Scope, Learner Volume &amp; Requirements{' '}
                            <span className="text-[#DC2626]">*</span>
                          </label>
                          <textarea
                            id="textarea-message"
                            rows={4}
                            required
                            placeholder="Tell us about your learner count, accreditation or assessment workflows, hosting needs, or desired launch timeline..."
                            value={formState.message}
                            onChange={(e) =>
                              setFormState((s) => ({ ...s, message: e.target.value }))
                            }
                            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-[#07090E] placeholder:text-slate-400 focus:border-[#1F78B4] focus:outline-none"
                          />
                          {formErrors.message && (
                            <p className="mt-1 text-xs text-[#DC2626]">{formErrors.message}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                          <p className="text-xs text-slate-500">
                            Protected under South African POPIA data privacy standards.
                          </p>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-lg kpit-gradient-bg kpit-gradient-bg-hover px-6 py-3 text-sm font-semibold text-white transition-all whitespace-nowrap shadow-xs"
                          >
                            <span>Submit Consultation &amp; Quote Request</span>
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          8. QUIET FOOTER (Official KP Informative Technologies Logo + Links)
      ====================================================================== */}
      <footer className="border-t border-[#D5E4F0] bg-[#F4F8FB] py-12 text-xs text-slate-600">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <a href="#top" aria-label="KP Informative Technologies Home" className="inline-block">
                <KpitLogo variant="footer" />
              </a>
              <p className="mt-3 max-w-md text-xs text-slate-600 leading-relaxed">
                Specialized in Learning Management Systems (LMS), high-concurrency cloud hosting,
                institutional web development, and digital growth from Johannesburg, South Africa.
              </p>
              <p className="mt-3 font-mono-tabular text-xs font-semibold text-[#143E68]">
                Call: 011 568 6597 · +27 67 215-6028 · info@kptechnologies.co.za
              </p>
            </div>

            <div>
              <p className="font-bold text-[#07090E]">EdTech Navigation</p>
              <ul className="mt-3 space-y-2">
                <li>
                  <a href="#sandbox" className="hover:text-[#1F78B4]">
                    Interactive LMS Sandbox
                  </a>
                </li>
                <li>
                  <a href="#capabilities" className="hover:text-[#1F78B4]">
                    Core Capabilities
                  </a>
                </li>
                <li>
                  <a href="#impact" className="hover:text-[#1F78B4]">
                    Institutional Case Studies
                  </a>
                </li>
                <li>
                  <a href="#packages" className="hover:text-[#1F78B4]">
                    LMS &amp; Hosting Packages
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-[#1F78B4]">
                    About KPIT
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-bold text-[#07090E]">Official Information</p>
              <ul className="mt-3 space-y-2">
                <li>Johannesburg, Gauteng, South Africa</li>
                <li>Mon – Sat: 8:00 AM – 5:00 PM SAST</li>
                <li>Sunday: Closed (24/7 Cloud SLA Standby)</li>
                <li>
                  <a
                    href="mailto:support@kptechnologies.co.za"
                    className="font-semibold text-[#1F78B4] hover:underline"
                  >
                    support@kptechnologies.co.za
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col justify-between gap-4 border-t border-[#D5E4F0] pt-6 sm:flex-row sm:items-center">
            <p>© 2026 KPIT – KP Informative Technologies. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-4 text-slate-500">
              <a href="#contact" className="hover:text-[#07090E]">
                POPIA Privacy Compliance
              </a>
              <span aria-hidden="true">·</span>
              <a href="#contact" className="hover:text-[#07090E]">
                SLA Terms &amp; Conditions
              </a>
              <span aria-hidden="true">·</span>
              <a href="#contact" className="hover:text-[#07090E]">
                Support Desk
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Technical Specification Modal */}
      <ServiceDetailModal
        service={activeModalService}
        onClose={() => setActiveModalService(null)}
        onSelectForProposal={handleSelectServiceForProposal}
      />
    </div>
  );
}
