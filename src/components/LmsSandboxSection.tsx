import React, { useState, useMemo } from 'react';
import { ArrowRight, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

export interface SandboxConfigPayload {
  environmentMode: string;
  learners: number;
  concurrentExamUsers: number;
  storageGb: number;
  offlineSync: boolean;
  setaReporting: boolean;
  estimatedMonthlyZar: number;
  recommendedCluster: string;
}

interface LmsSandboxSectionProps {
  onApplyToProposal: (payload: SandboxConfigPayload) => void;
}

type EnvironmentTab = 'seta' | 'university' | 'corporate';

interface RubricCriterion {
  id: string;
  title: string;
  unitStandard: string;
  weight: number;
  selectedLevel: 0 | 1 | 2;
}

export const LmsSandboxSection: React.FC<LmsSandboxSectionProps> = ({ onApplyToProposal }) => {
  const [activeEnv, setActiveEnv] = useState<EnvironmentTab>('seta');
  const [learners, setLearners] = useState<number>(2500);
  const [concurrentExamUsers, setConcurrentExamUsers] = useState<number>(450);
  const [storageGb, setStorageGb] = useState<number>(800);
  const [offlineSync, setOfflineSync] = useState<boolean>(true);
  const [setaReporting, setSetaReporting] = useState<boolean>(true);

  const [rubricCriteria, setRubricCriteria] = useState<RubricCriterion[]>([
    {
      id: 'poe-1',
      title: 'Formative Knowledge Questionnaire (Auto-Graded)',
      unitStandard: 'US-115753 · NQF Level 5',
      weight: 30,
      selectedLevel: 2,
    },
    {
      id: 'poe-2',
      title: 'Practical Workplace Evidence Logbook Upload',
      unitStandard: 'QCTO Workplace Module 02',
      weight: 40,
      selectedLevel: 1,
    },
    {
      id: 'poe-3',
      title: 'Summative Proctored Assessment Verification',
      unitStandard: 'EISA Readiness Standard',
      weight: 30,
      selectedLevel: 2,
    },
  ]);

  const [selectedBandwidthMode, setSelectedBandwidthMode] = useState<'standard' | 'low-data'>(
    'low-data'
  );
  const [activeWeekIndex, setActiveWeekIndex] = useState<number>(3);

  const handleCriterionChange = (id: string, level: 0 | 1 | 2) => {
    setRubricCriteria((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selectedLevel: level } : item))
    );
  };

  const resetSandbox = () => {
    setLearners(2500);
    setConcurrentExamUsers(450);
    setStorageGb(800);
    setOfflineSync(true);
    setSetaReporting(true);
    setRubricCriteria([
      {
        id: 'poe-1',
        title: 'Formative Knowledge Questionnaire (Auto-Graded)',
        unitStandard: 'US-115753 · NQF Level 5',
        weight: 30,
        selectedLevel: 2,
      },
      {
        id: 'poe-2',
        title: 'Practical Workplace Evidence Logbook Upload',
        unitStandard: 'QCTO Workplace Module 02',
        weight: 40,
        selectedLevel: 1,
      },
      {
        id: 'poe-3',
        title: 'Summative Proctored Assessment Verification',
        unitStandard: 'EISA Readiness Standard',
        weight: 30,
        selectedLevel: 2,
      },
    ]);
  };

  const rubricScoreSummary = useMemo(() => {
    let totalWeighted = 0;
    let anyNotCompetent = false;
    rubricCriteria.forEach((c) => {
      if (c.selectedLevel === 0) anyNotCompetent = true;
      const multiplier = c.selectedLevel === 2 ? 1 : c.selectedLevel === 1 ? 0.78 : 0.35;
      totalWeighted += Math.round(c.weight * multiplier);
    });
    const status =
      anyNotCompetent || totalWeighted < 65
        ? 'REQUIRES REMEDIATION'
        : totalWeighted >= 85
          ? 'COMPETENT WITH DISTINCTION'
          : 'COMPETENT · POE VERIFIED';
    return { totalWeighted, status, isCompetent: !anyNotCompetent && totalWeighted >= 65 };
  }, [rubricCriteria]);

  const architectureMetrics = useMemo(() => {
    const vCpu = Math.max(4, Math.ceil(concurrentExamUsers / 75) * 2);
    const ramGb = Math.max(8, vCpu * 4);
    const bandwidthMbps = Math.round(
      concurrentExamUsers * (selectedBandwidthMode === 'low-data' ? 0.85 : 2.4)
    );

    const baseCost = 4200;
    const learnerCost = Math.round((learners / 500) * 650);
    const concurrencyCost = Math.round((concurrentExamUsers / 100) * 580);
    const storageCost = Math.round((storageGb / 250) * 320);
    const addonsCost = (offlineSync ? 950 : 0) + (setaReporting ? 850 : 0);
    const estimatedMonthlyZar =
      baseCost + learnerCost + concurrencyCost + storageCost + addonsCost;

    let recommendedCluster = 'KPIT Starter Dedicated Node (Johannesburg DC1)';
    if (learners > 6000 || concurrentExamUsers > 1000) {
      recommendedCluster = 'KPIT Enterprise Auto-Scaling Multi-Node Cluster (JHB + CPT)';
    } else if (learners > 1200 || concurrentExamUsers > 250) {
      recommendedCluster = 'KPIT High-Availability Dual-Node LMS Cluster (Johannesburg DC1)';
    }

    const concurrencyRatio = concurrentExamUsers / Math.max(1, learners);
    const loadStatus =
      concurrencyRatio > 0.35 || concurrentExamUsers > 1500
        ? 'HIGH EXAM CONCURRENCY · AUTO-SCALING ACTIVE'
        : 'NOMINAL LOAD · REDIS SESSION CACHING READY';

    return {
      vCpu,
      ramGb,
      bandwidthMbps,
      estimatedMonthlyZar,
      recommendedCluster,
      loadStatus,
      isHighLoad: concurrencyRatio > 0.35 || concurrentExamUsers > 1500,
    };
  }, [
    learners,
    concurrentExamUsers,
    storageGb,
    offlineSync,
    setaReporting,
    selectedBandwidthMode,
  ]);

  const environmentLabels: Record<EnvironmentTab, string> = {
    seta: 'SETA / QCTO Accredited Training & POE Portal',
    university: 'Higher Ed & TVET Virtual Campus',
    corporate: 'Corporate L&D & Compliance Academy',
  };

  const weeklyRetentionData = [
    { week: 'Week 1: Orientation', standardRate: 94, kpitRate: 98 },
    { week: 'Week 2: Core Theory', standardRate: 76, kpitRate: 93 },
    { week: 'Week 3: Practical Lab', standardRate: 61, kpitRate: 89 },
    { week: 'Week 4: Summative Exam', standardRate: 49, kpitRate: 86 },
  ];

  return (
    <section
      id="sandbox"
      aria-labelledby="sandbox-heading"
      className="border-y border-[#D5E4F0] bg-[#F4F8FB] py-20"
    >
      <div className="mx-auto max-w-[1200px] px-6">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs text-slate-600">
              <span className="font-bold text-[#143E68]">
                Interactive EdTech Architecture &amp; Learning Simulation
              </span>
              <span aria-hidden="true"> · </span>
              <span>Live Capacity &amp; Rubric Sandbox</span>
            </p>
            <h2
              id="sandbox-heading"
              className="mt-2 font-display text-3xl font-bold tracking-tight text-[#07090E] sm:text-4xl"
            >
              Simulate Your Institutional LMS &amp; Cloud Infrastructure Before You Build
            </h2>
            <p className="mt-3 text-base text-slate-600">
              Test how KP Informative Technologies engineers digital assessment rubrics, low-data
              student delivery, and high-concurrency Johannesburg cloud hosting tailored to your
              exact learner volume.
            </p>
          </div>

          {/* Interactive Environment Selector */}
          <div
            role="tablist"
            aria-label="Select EdTech institutional simulation mode"
            className="inline-flex flex-wrap items-center gap-1 rounded-lg bg-white p-1.5 border border-[#D5E4F0]"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeEnv === 'seta'}
              onClick={() => setActiveEnv('seta')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                activeEnv === 'seta'
                  ? 'kpit-gradient-bg text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#07090E]'
              }`}
            >
              SETA &amp; QCTO Portal
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeEnv === 'university'}
              onClick={() => setActiveEnv('university')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                activeEnv === 'university'
                  ? 'kpit-gradient-bg text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#07090E]'
              }`}
            >
              University &amp; TVET Campus
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeEnv === 'corporate'}
              onClick={() => setActiveEnv('corporate')}
              className={`rounded-md px-3.5 py-2 text-xs font-semibold transition-all whitespace-nowrap ${
                activeEnv === 'corporate'
                  ? 'kpit-gradient-bg text-white shadow-xs'
                  : 'text-slate-600 hover:text-[#07090E]'
              }`}
            >
              Corporate L&amp;D Academy
            </button>
          </div>
        </div>

        {/* Two-Zone Sandbox Layout */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* LEFT ZONE: Interactive Stage (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-xl border border-[#D5E4F0] bg-white p-6 sm:p-8">
            <div>
              {/* Stage Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <div>
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-[#1F78B4]">Live Workspace Preview</span>
                    <span aria-hidden="true"> · </span>
                    <span>{environmentLabels[activeEnv]}</span>
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-[#07090E]">
                    {activeEnv === 'seta' &&
                      'Interactive Portfolio of Evidence (POE) & Rubric Grading Engine'}
                    {activeEnv === 'university' &&
                      'Low-Bandwidth Virtual Campus & Exam Concurrency Monitor'}
                    {activeEnv === 'corporate' &&
                      'Enterprise Onboarding Velocity & Department Mastery Matrix'}
                  </h3>
                </div>
                <div className="text-xs font-mono-tabular">
                  {architectureMetrics.isHighLoad ? (
                    <span className="inline-flex items-center gap-1.5 text-[#D97706] font-semibold">
                      <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>▲ {architectureMetrics.loadStatus}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-[#059669] font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>● {architectureMetrics.loadStatus}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* TAB 1: SETA & QCTO Rubric Simulator */}
              {activeEnv === 'seta' && (
                <div className="mt-6 space-y-5">
                  <p className="text-sm text-slate-600">
                    Click any assessment level below to test how KPIT’s automated LMS rubric matrix
                    calculates learner competency, moderator readiness, and digital certificate
                    eligibility in real time:
                  </p>

                  <div className="space-y-4">
                    {rubricCriteria.map((criterion) => (
                      <div
                        key={criterion.id}
                        className="rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-sm font-bold text-[#07090E]">
                            {criterion.title}
                          </span>
                          <span className="text-xs font-mono-tabular text-slate-500">
                            {criterion.unitStandard} · Weight: {criterion.weight}%
                          </span>
                        </div>
                        <div className="mt-3 grid grid-cols-3 gap-2">
                          {(
                            [
                              { level: 0, label: 'Not Yet Competent (35%)' },
                              { level: 1, label: 'Competent (78%)' },
                              { level: 2, label: 'Mastery (100%)' },
                            ] as const
                          ).map((opt) => (
                            <button
                              key={opt.level}
                              type="button"
                              onClick={() => handleCriterionChange(criterion.id, opt.level)}
                              className={`rounded-md border px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap truncate ${
                                criterion.selectedLevel === opt.level
                                  ? opt.level === 0
                                    ? 'border-[#DC2626] bg-red-50 text-[#DC2626]'
                                    : 'border-[#1F78B4] bg-[#EBF3F9] text-[#143E68]'
                                  : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Rubric Result Readout */}
                  <div className="flex flex-col justify-between gap-4 rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs text-slate-500">
                        Automated Assessor &amp; Moderator Outcome
                      </p>
                      <p
                        className={`mt-1 text-sm font-mono-tabular font-bold ${
                          rubricScoreSummary.isCompetent ? 'text-[#059669]' : 'text-[#DC2626]'
                        }`}
                      >
                        {rubricScoreSummary.isCompetent ? '● ' : '▲ '}
                        {rubricScoreSummary.status}
                      </p>
                    </div>
                    <div className="text-left sm:text-right font-mono-tabular">
                      <span className="text-xs text-slate-500 block">
                        Weighted POE Score ({learners.toLocaleString()} Cohort Active)
                      </span>
                      <span className="text-2xl font-bold text-[#143E68]">
                        {rubricScoreSummary.totalWeighted}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: University & TVET Campus Simulator */}
              {activeEnv === 'university' && (
                <div className="mt-6 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-slate-600">
                      Compare learner retention and mobile bandwidth usage across academic weeks:
                    </p>
                    <div className="inline-flex rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-1">
                      <button
                        type="button"
                        onClick={() => setSelectedBandwidthMode('low-data')}
                        className={`rounded-md px-3 py-1 text-xs font-semibold transition-all whitespace-nowrap ${
                          selectedBandwidthMode === 'low-data'
                            ? 'kpit-gradient-bg text-white'
                            : 'text-slate-600 hover:text-[#07090E]'
                        }`}
                      >
                        KPIT Low-Data PWA Mode
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedBandwidthMode('standard')}
                        className={`rounded-md px-3 py-1 text-xs font-semibold transition-all whitespace-nowrap ${
                          selectedBandwidthMode === 'standard'
                            ? 'kpit-gradient-bg text-white'
                            : 'text-slate-600 hover:text-[#07090E]'
                        }`}
                      >
                        Standard HD Stream
                      </button>
                    </div>
                  </div>

                  {/* Interactive Week Bars */}
                  <div className="space-y-3 rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-4">
                    {weeklyRetentionData.map((item, idx) => {
                      const activeRate =
                        selectedBandwidthMode === 'low-data' ? item.kpitRate : item.standardRate;
                      return (
                        <button
                          key={item.week}
                          type="button"
                          onClick={() => setActiveWeekIndex(idx)}
                          className={`w-full text-left rounded-md p-2.5 transition-colors ${
                            activeWeekIndex === idx ? 'bg-white shadow-xs' : 'hover:bg-white/60'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-mono-tabular">
                            <span className="font-bold text-[#07090E]">{item.week}</span>
                            <span className="text-slate-600">
                              Completion: {activeRate}% (
                              {Math.round((learners * activeRate) / 100).toLocaleString()} students)
                            </span>
                          </div>
                          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
                            <div
                              className="h-full kpit-gradient-bg transition-transform duration-150 origin-left"
                              style={{ transform: `scaleX(${activeRate / 100})` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 font-mono-tabular">
                    <div className="rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-3.5">
                      <span className="text-xs text-slate-500 block">Selected Milestone</span>
                      <span className="mt-1 text-sm font-bold text-[#07090E] block truncate">
                        {weeklyRetentionData[activeWeekIndex].week}
                      </span>
                    </div>
                    <div className="rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-3.5">
                      <span className="text-xs text-slate-500 block">Mobile Data Saved</span>
                      <span className="mt-1 text-sm font-bold text-[#059669] block">
                        {selectedBandwidthMode === 'low-data'
                          ? '● -64% Data Usage'
                          : '○ Baseline Stream'}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1 rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-3.5">
                      <span className="text-xs text-slate-500 block">Throughput Required</span>
                      <span className="mt-1 text-sm font-bold text-[#143E68] block">
                        {architectureMetrics.bandwidthMbps} Mbps Peak
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: Corporate L&D Academy Simulator */}
              {activeEnv === 'corporate' && (
                <div className="mt-6 space-y-5">
                  <p className="text-sm text-slate-600">
                    Real-time simulation of enterprise workforce onboarding, POPIA/Cybersecurity
                    compliance certification, and automated HRIS skill-matrix reporting for{' '}
                    <span className="font-bold text-[#07090E] font-mono-tabular">
                      {learners.toLocaleString()} employees
                    </span>
                    :
                  </p>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-4">
                      <p className="text-xs text-slate-500">Time-to-Productivity Reduction</p>
                      <p className="mt-1 font-mono-tabular text-2xl font-bold text-[#07090E]">
                        -46% Onboarding Days
                      </p>
                      <p className="mt-2 text-xs text-slate-600">
                        Automated role-based learning paths assign mandatory modules upon employee
                        hire.
                      </p>
                    </div>
                    <div className="rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-4">
                      <p className="text-xs text-slate-500">Estimated Annual Trainer Hours Saved</p>
                      <p className="mt-1 font-mono-tabular text-2xl font-bold text-[#1F78B4]">
                        {Math.round(learners * 1.8).toLocaleString()} Hours / Yr
                      </p>
                      <p className="mt-2 text-xs text-slate-600">
                        Replaces repetitive live induction webinars with interactive SCORM &amp;
                        video checkpoints.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-[#D5E4F0] bg-[#F4F8FB] p-4">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>Departmental Compliance Readiness</span>
                      <span className="font-mono-tabular">ISO / POPIA / Skills Levy (WSP/ATR)</span>
                    </div>
                    <div className="mt-3 space-y-2.5 text-xs font-mono-tabular">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Operations &amp; Field Engineering</span>
                        <span className="font-bold text-[#059669]">● 96.4% Certified</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Finance, Governance &amp; Risk</span>
                        <span className="font-bold text-[#059669]">● 99.1% Certified</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700">Customer Support &amp; Sales Cohorts</span>
                        <span className="font-bold text-[#1F78B4]">● 91.8% Certified</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Stage Bottom Architecture Summary Bar */}
            <div className="mt-6 border-t border-slate-200 pt-5">
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-500 block">Recommended KPIT Cloud Architecture</span>
                  <span className="font-bold text-[#143E68]">
                    {architectureMetrics.recommendedCluster}
                  </span>
                </div>
                <div className="font-mono-tabular text-slate-700">
                  <span>{architectureMetrics.vCpu} Dedicated vCPU</span>
                  <span aria-hidden="true"> · </span>
                  <span>{architectureMetrics.ramGb} GB RAM</span>
                  <span aria-hidden="true"> · </span>
                  <span>{storageGb.toLocaleString()} GB NVMe</span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT ZONE: Control & Concept Deck (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-[#D5E4F0] bg-white p-6 sm:p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <h3 className="text-base font-bold text-[#07090E]">
                    Institutional Capacity Controls
                  </h3>
                  <p className="text-xs text-slate-500">
                    Adjust parameters to size your LMS &amp; hosting environment
                  </p>
                </div>
                <button
                  type="button"
                  onClick={resetSandbox}
                  aria-label="Reset sandbox parameters to default"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-[#F4F8FB] hover:text-[#07090E] transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Slider 1: Active Enrolled Learners */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="slider-learners" className="font-semibold text-[#07090E]">
                    Active Enrolled Learners
                  </label>
                  <span className="font-mono-tabular font-bold text-[#1F78B4]">
                    {learners.toLocaleString()} learners
                  </span>
                </div>
                <input
                  id="slider-learners"
                  type="range"
                  min={250}
                  max={15000}
                  step={250}
                  value={learners}
                  onChange={(e) => setLearners(Number(e.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[#1F78B4]"
                />
                <div className="mt-1 flex justify-between text-xs font-mono-tabular text-slate-400">
                  <span>250</span>
                  <span>5,000</span>
                  <span>10,000</span>
                  <span>15,000 learners</span>
                </div>
              </div>

              {/* Slider 2: Concurrent Exam Users */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="slider-concurrent" className="font-semibold text-[#07090E]">
                    Peak Concurrent Exam Users
                  </label>
                  <span className="font-mono-tabular font-bold text-[#1F78B4]">
                    {concurrentExamUsers.toLocaleString()} simultaneous users
                  </span>
                </div>
                <input
                  id="slider-concurrent"
                  type="range"
                  min={50}
                  max={3000}
                  step={50}
                  value={concurrentExamUsers}
                  onChange={(e) => setConcurrentExamUsers(Number(e.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[#1F78B4]"
                />
                <div className="mt-1 flex justify-between text-xs font-mono-tabular text-slate-400">
                  <span>50</span>
                  <span>1,000</span>
                  <span>2,000</span>
                  <span>3,000 peak</span>
                </div>
              </div>

              {/* Slider 3: Course Video & SCORM Storage */}
              <div>
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="slider-storage" className="font-semibold text-[#07090E]">
                    Video &amp; SCORM Repository Storage
                  </label>
                  <span className="font-mono-tabular font-bold text-[#1F78B4]">
                    {storageGb.toLocaleString()} GB NVMe
                  </span>
                </div>
                <input
                  id="slider-storage"
                  type="range"
                  min={250}
                  max={5000}
                  step={250}
                  value={storageGb}
                  onChange={(e) => setStorageGb(Number(e.target.value))}
                  className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-[#1F78B4]"
                />
                <div className="mt-1 flex justify-between text-xs font-mono-tabular text-slate-400">
                  <span>250 GB</span>
                  <span>2,500 GB</span>
                  <span>5,000 GB</span>
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-700">
                    Offline Mobile App &amp; Low-Data Sync Mode
                  </span>
                  <input
                    type="checkbox"
                    checked={offlineSync}
                    onChange={(e) => setOfflineSync(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#1F78B4] focus:ring-[#1F78B4]"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span className="text-xs font-semibold text-slate-700">
                    Automated SETA / QCTO &amp; WSP/ATR Compliance Exports
                  </span>
                  <input
                    type="checkbox"
                    checked={setaReporting}
                    onChange={(e) => setSetaReporting(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-[#1F78B4] focus:ring-[#1F78B4]"
                  />
                </label>
              </div>
            </div>

            {/* Real-Time Investment Estimate & Action */}
            <div className="mt-6 rounded-xl bg-[#0B1F36] p-5 text-white border border-[#1F78B4]/40">
              <div className="flex items-baseline justify-between gap-2">
                <div>
                  <span className="text-xs text-[#2AA7EA] font-semibold block">
                    Estimated Managed LMS &amp; Cloud Hosting
                  </span>
                  <span className="text-xs text-slate-300">
                    Includes 24/7 Johannesburg SLA &amp; Daily Backups
                  </span>
                </div>
                <div className="text-right font-mono-tabular">
                  <span className="text-2xl font-bold text-white">
                    R {architectureMetrics.estimatedMonthlyZar.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-300 block">per month (excl. VAT)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  onApplyToProposal({
                    environmentMode: environmentLabels[activeEnv],
                    learners,
                    concurrentExamUsers,
                    storageGb,
                    offlineSync,
                    setaReporting,
                    estimatedMonthlyZar: architectureMetrics.estimatedMonthlyZar,
                    recommendedCluster: architectureMetrics.recommendedCluster,
                  })
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg kpit-gradient-bg kpit-gradient-bg-hover px-4 py-3 text-xs font-semibold text-white transition-all whitespace-nowrap shadow-xs"
              >
                <span>Load Configuration into Proposal Request</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
