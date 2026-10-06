export interface EdTechService {
  id: string;
  index: string;
  category: 'lms' | 'hosting' | 'web' | 'marketing';
  categoryLabel: string;
  title: string;
  shortSummary: string;
  outcomeMetric: string;
  turnaroundSla: string;
  complianceStandards: string;
  spanClass: string;
  imagePath?: string;
  imageAlt?: string;
  architectureHighlights: string[];
  deliverables: string[];
  idealFor: string;
}

export interface CaseStudy {
  id: string;
  institution: string;
  sector: string;
  location: string;
  headlineMetric: string;
  secondaryMetric: string;
  timeframe: string;
  challenge: string;
  solution: string;
  outcomeQuote: string;
  spokespersonName: string;
  spokespersonRole: string;
  serviceId: string;
}

export interface WorkingStep {
  stepNumber: string;
  title: string;
  subtitle: string;
  description: string;
  deliverableOutput: string;
  duration: string;
}

export interface PricingPackage {
  id: string;
  name: string;
  targetAudience: string;
  monthlyZar: number;
  turnkeyZar: number;
  learnerCapacity: string;
  concurrentUsers: string;
  storageIncluded: string;
  slaGuarantee: string;
  featured?: boolean;
  includedFeatures: string[];
}

export const KPIT_COMPANY_INFO = {
  name: 'KP Informative Technologies',
  shortName: 'KPIT',
  tagline: 'A legacy of innovation, a future of endless possibilities',
  founded: '2021',
  headquarters: 'Johannesburg, Gauteng, South Africa',
  phones: ['+27 11 568-6597', '+27 67 215-6028'],
  primaryPhoneDisplay: '011 568 6597',
  secondaryPhoneDisplay: '+27 67 215-6028',
  emails: ['info@kptechnologies.co.za', 'support@kptechnologies.co.za'],
  hours: 'Mon – Sat: 8:00 AM – 5:00 PM SAST · Sunday: Closed',
  website: 'https://www.kptechnologies.co.za/',
  mission:
    'To deliver cutting-edge, affordable, and tailored digital learning and IT solutions that help educational institutions, training providers, and enterprises build strong online identities, improve learner outcomes, and achieve sustainable success.',
  vision:
    'To be a leading education technology and digital solutions provider in Africa, transforming how institutions, businesses, and individuals connect, learn, and grow through innovation, reliability, and excellence.',
  values: [
    {
      title: 'Innovation',
      description:
        'We engineer forward-thinking e-learning platforms, interactive assessments, and cloud architectures built for African connectivity realities.',
    },
    {
      title: 'Integrity',
      description:
        'We build institutional trust through transparent SLAs, strict POPIA student data governance, and honest technical advisory.',
    },
    {
      title: 'Customer & Learner Success',
      description:
        'Our achievement is measured by course completion rates, exam-week uptime, and seamless educator workflows.',
    },
    {
      title: 'Excellence',
      description:
        'Every LMS deployment, campus portal, and managed server cluster undergoes rigorous load testing before launch.',
    },
    {
      title: 'Collaboration',
      description:
        'We work side by side with academic deans, SETA assessors, instructional designers, and internal IT teams across South Africa and beyond.',
    },
  ],
};

export const EDTECH_SERVICES: EdTechService[] = [
  {
    id: 'lms-platforms',
    index: '01',
    category: 'lms',
    categoryLabel: 'LMS & Courseware',
    title: '01. Custom Learning Management Systems (LMS)',
    shortSummary:
      'Bespoke, mobile-first e-learning platforms engineered for universities, TVET colleges, SETA/QCTO accredited training providers, and corporate academies.',
    outcomeMetric: 'Up to 15,000+ active learners per institutional instance',
    turnaroundSla: '4–6 Weeks Turnkey Rollout',
    complianceStandards: 'SCORM 1.2 & 2004 · xAPI · LTI 1.3 · SETA / QCTO POE Ready',
    spanClass: 'lg:col-span-2',
    imagePath: '/src/assets/images/lms_platform_showcase_1791288357988.jpg',
    imageAlt: 'Laptop and digital tablet showing KP Informative Technologies custom LMS course interface and student analytics',
    architectureHighlights: [
      'Custom-branded Moodle, Canvas, or bespoke React/Node.js LMS workspaces tailored to your curriculum structure.',
      'Integrated Portfolio of Evidence (POE) submission workflows, rubric grading matrices, and assessor/moderator queues.',
      'Low-bandwidth progressive web app (PWA) mode enabling learners across South Africa to download modules for offline study.',
      'Automated verifiable PDF certificate generation with QR validation and real-time learner progress analytics.',
    ],
    deliverables: [
      'Full institutional branding & custom domain configuration',
      'Role-based portals for Students, Lecturers, Assessors, Moderators & Admins',
      'Automated SETA / QCTO learner progress & attendance export templates',
      'Interactive quiz engine, video streaming optimization & plagiarism check integration',
      'Comprehensive administrator & faculty training workshops in Johannesburg or remotely',
    ],
    idealFor: 'Accredited Skills Development Providers (SDPs), Private Higher Education Institutions, TVET Colleges & Corporate L&D Academies.',
  },
  {
    id: 'cloud-lms-hosting',
    index: '02',
    category: 'hosting',
    categoryLabel: 'Cloud & Hosting',
    title: '02. High-Concurrency LMS & Campus Cloud Hosting',
    shortSummary:
      'Fast, secure, and load-balanced cloud hosting with 24/7 technical support engineered to eliminate exam-week crashes and latency bottlenecks.',
    outcomeMetric: '99.98% verified uptime with automated daily off-site backups',
    turnaroundSla: '24–48 Hours Provisioning & Migration',
    complianceStandards: 'POPIA Data Sovereignty · TLS 1.3 · Automated DDoS Mitigation',
    spanClass: 'lg:col-span-1',
    imagePath: '/src/assets/images/cloud_hosting_infrastructure_1791288369459.jpg',
    imageAlt: 'High-reliability enterprise cloud server infrastructure corridor with cobalt lighting',
    architectureHighlights: [
      'Auto-scaling compute nodes optimized for simultaneous online examinations and video lecture delivery.',
      'South African low-latency edge caching paired with isolated database clusters for rapid page loads.',
      'Continuous 24/7 monitoring, automated malware protection, and instant rollback snapshots.',
    ],
    deliverables: [
      'Zero-downtime migration of existing Moodle, WordPress LMS, or custom web portals',
      'Dedicated NVMe SSD storage for high-definition lecture videos & SCORM packages',
      'Institutional email hosting & SSL security certificate lifecycle management',
      'Direct 24/7 standby support from KPIT Johannesburg infrastructure engineers',
    ],
    idealFor: 'Schools, universities, and training academies experiencing slow load times or downtime during peak assessment periods.',
  },
  {
    id: 'campus-web-development',
    index: '03',
    category: 'web',
    categoryLabel: 'Campus Web & SIS',
    title: '03. Institutional Web Portals & Student Enrolment Systems',
    shortSummary:
      'Responsive, accessible websites and online application portals that convert prospective students into enrolled learners with seamless fee payment and SIS sync.',
    outcomeMetric: '+64% faster online student registration & document verification',
    turnaroundSla: '3–5 Weeks Delivery',
    complianceStandards: 'WCAG 2.1 AA Accessible · PayFast / Peach Payments / Ozow Ready',
    spanClass: 'lg:col-span-1',
    architectureHighlights: [
      'End-to-end digital student application funnels with ID/matric upload, automated status tracking, and instant fee invoicing.',
      'Two-way API integration between your public institutional website, Student Information System (SIS), and LMS.',
      'Interactive course catalogs with dynamic faculty filters, prospectus downloads, and intake countdowns.',
    ],
    deliverables: [
      'Custom UI/UX design aligned with institutional academic identity',
      'Online student application & document upload portal',
      'South African payment gateway integration for tuition & short-course sales',
      'Mobile-responsive faculty directory, academic calendar & alumni verification portal',
    ],
    idealFor: 'Colleges, private academies, K-12 independent schools, and professional training institutes modernizing student intake.',
  },
  {
    id: 'instructional-software',
    index: '04',
    category: 'lms',
    categoryLabel: 'LMS & Courseware',
    title: '04. Interactive Courseware & Educational Software Engineering',
    shortSummary:
      'Custom educational software, SCORM/H5P interactive simulations, and assessment portals that turn static PDF study guides into engaging digital learning experiences.',
    outcomeMetric: '3.2x higher learner engagement compared to static PDF modules',
    turnaroundSla: '2–4 Weeks per Curriculum Module Batch',
    complianceStandards: 'HTML5 · H5P · SCORM 2004 · Mobile Touch Optimized',
    spanClass: 'lg:col-span-1',
    architectureHighlights: [
      'Conversion of legacy print textbooks and facilitator guides into interactive, multimedia-rich digital modules.',
      'Custom rubric-based grading tools, virtual laboratory simulations, and automated formative feedback engines.',
      'Seamless single sign-on (SSO) with Microsoft 365 Education and Google Workspace for Education.',
    ],
    deliverables: [
      'Interactive SCORM / H5P module packages ready for any LMS',
      'Custom assessment & automated grading rubric applications',
      'Micro-credentialing & digital badge pathways for continuous professional development (CPD)',
      'Full source files and instructional design documentation',
    ],
    idealFor: 'Curriculum directors, corporate L&D teams, and publishers transitioning print curricula to interactive digital formats.',
  },
  {
    id: 'edtech-digital-marketing',
    index: '05',
    category: 'marketing',
    categoryLabel: 'Enrolment Growth',
    title: '05. Student Enrolment Digital Marketing & Academic SEO',
    shortSummary:
      'Targeted search engine optimization, conversion-focused enrolment campaigns, and social media strategy designed to fill academic intakes and short-course cohorts.',
    outcomeMetric: '+140% qualified student inquiries within 2 academic intake cycles',
    turnaroundSla: 'Continuous Monthly Campaign Execution',
    complianceStandards: 'POPIA Opt-In Compliant · Full Enrolment Attribution Analytics',
    spanClass: 'lg:col-span-1',
    architectureHighlights: [
      'High-intent search engine optimization targeting South African learners searching for accredited diplomas, certificates, and corporate training.',
      'Multi-channel paid acquisition across Google Search, LinkedIn, and Meta with real-time cost-per-enrolment tracking.',
      'Automated prospective student nurturing sequences via email and WhatsApp Business integration.',
    ],
    deliverables: [
      'Comprehensive technical & academic keyword SEO audit',
      'Dedicated landing pages for flagship qualifications and intake drives',
      'Monthly enrolment pipeline & ROI performance reporting',
      'Brand visibility & social media content management for educational institutions',
    ],
    idealFor: 'Private colleges, online academies, and B2B training providers seeking predictable student enrollment growth.',
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'gauteng-skills-academy',
    institution: 'Gauteng Accredited Skills & TVET Consortium',
    sector: 'SETA / QCTO Accredited Training',
    location: 'Johannesburg & Pretoria, South Africa',
    headlineMetric: '+184% Learner Completion Rate in 6 Months',
    secondaryMetric: '4,800 Accredited Learners Onboarded · 100% Digital POE Audit Pass',
    timeframe: '6-Month Post-Deployment Audit',
    challenge:
      'Relied on manual paper-based Portfolios of Evidence (POE) and an unstable shared server that crashed whenever more than 120 learners logged in for assessments.',
    solution:
      'KP Informative Technologies engineered a custom Moodle-based LMS with dedicated assessor moderation workflows, mobile data-saver courseware, and high-concurrency Johannesburg cloud hosting.',
    outcomeQuote:
      'Before partnering with KP Informative Technologies, our external moderation audits took three weeks of physical paperwork and our portal timed out during tests. After migrating to KPIT’s managed LMS and digital POE workflow, learner completion rose by 184% and we passed our QCTO verification with zero non-conformances.',
    spokespersonName: 'Dr. Thabo Mokoena',
    spokespersonRole: 'Director of Academic Quality & E-Learning',
    serviceId: 'lms-platforms',
  },
  {
    id: 'southern-african-business-school',
    institution: 'Apex Executive & Higher Education Institute',
    sector: 'Private Higher Education',
    location: 'Sandton, Johannesburg',
    headlineMetric: '99.98% Uptime Across 8,500 Exam Sittings',
    secondaryMetric: '1.2s Average Page Load · -38% Annual IT Infrastructure Spend',
    timeframe: 'Full Academic Year 2025–2026',
    challenge:
      'Semester-end online examinations suffered severe database locks and 20-minute outages, damaging institutional reputation and overwhelming internal IT staff.',
    solution:
      'Provisioned an auto-scaling KPIT Cloud LMS cluster with isolated Redis session caching, automated off-site backups, and 24/7 live exam-week engineering support.',
    outcomeQuote:
      'Moving our virtual campus and hosting infrastructure to KP Informative Technologies eliminated exam-week downtime completely. Over 8,500 summative exam sittings ran concurrently without a single dropped submission.',
    spokespersonName: 'Naledi Van Der Merwe',
    spokespersonRole: 'Chief Information Officer',
    serviceId: 'cloud-lms-hosting',
  },
  {
    id: 'avenir-stem-digital-college',
    institution: 'Avenir Digital Career & Coding Academy',
    sector: 'EdTech & Professional Upskilling',
    location: 'Johannesburg & Cape Town (Hybrid)',
    headlineMetric: '+142% Qualified Student Enrolments',
    secondaryMetric: '-41% Cost Per Enrolled Student · 3.4x Organic Search Traffic',
    timeframe: 'Two Consecutive Intake Quarters',
    challenge:
      'Prospective students abandoned the legacy PDF application process, and the institution ranked poorly for accredited tech and business short courses in South Africa.',
    solution:
      'Rebuilt the institutional web portal with a 4-step online enrolment funnel, instant tuition payment integration, and targeted academic SEO & digital marketing campaigns.',
    outcomeQuote:
      'KPIT transformed our website from a static brochure into an automated enrolment engine. Applications are verified in minutes, sync directly to our LMS, and our cohort intakes filled three weeks ahead of schedule.',
    spokespersonName: 'Sipho Dlamini',
    spokespersonRole: 'Head of Admissions & Growth',
    serviceId: 'campus-web-development',
  },
];

export const WORKING_STEPS: WorkingStep[] = [
  {
    stepNumber: '01',
    title: '01. Select EdTech Service & Scope',
    subtitle: 'Institutional Alignment',
    description:
      'Choose the ICT and e-learning capabilities that match your institutional objectives—from a turnkey Learning Management System to high-availability cloud hosting or an online admissions portal.',
    deliverableOutput: 'Initial Capability Selection & Learner Volume Profile',
    duration: 'Day 1',
  },
  {
    stepNumber: '02',
    title: '02. Connect With Our Johannesburg Team',
    subtitle: 'Direct Discovery Briefing',
    description:
      'Share your current curriculum format, learner concurrency targets, accreditation requirements (SETA, QCTO, CHE, or corporate L&D), and timeline via our consultation desk.',
    deliverableOutput: 'Dedicated KPIT Solutions Architect Assigned',
    duration: 'Within 4 Business Hours',
  },
  {
    stepNumber: '03',
    title: '03. Pedagogical & Technical Audit',
    subtitle: 'Architecture & Infrastructure Assessment',
    description:
      'We evaluate your existing digital infrastructure, hosting load, student workflows, and integration needs so we can engineer the exact right-sized ICT and EdTech blueprint.',
    deliverableOutput: 'Comprehensive Technical Architecture & Cost Blueprint',
    duration: 'Days 2–4',
  },
  {
    stepNumber: '04',
    title: '04. Tailored Deployment & 24/7 Support',
    subtitle: 'Engineering, Training & SLA Care',
    description:
      'Our engineering and instructional systems team deploys your platform, migrates learner data, trains your faculty and administrators, and backs your institution with 24/7 monitoring.',
    deliverableOutput: 'Production LMS / Portal Launch + Ongoing 24/7 SLA',
    duration: '2–6 Weeks Turnkey Rollout',
  },
];

export const PRICING_PACKAGES: PricingPackage[] = [
  {
    id: 'starter-academy',
    name: 'Starter Training Academy',
    targetAudience: 'Independent training providers, bootcamps & growing schools launching structured e-learning.',
    monthlyZar: 4850,
    turnkeyZar: 28500,
    learnerCapacity: 'Up to 500 Active Learners',
    concurrentUsers: '120 Simultaneous Exam Users',
    storageIncluded: '250 GB NVMe Course & Video Storage',
    slaGuarantee: '99.9% Uptime SLA · Business Hours + Exam Standby Support',
    includedFeatures: [
      'Custom-branded LMS portal with institutional domain & SSL',
      'SCORM 1.2/2004, H5P interactive modules & automated quiz engine',
      'Automated PDF certificate issuance with verification codes',
      'Daily encrypted cloud backups hosted in South Africa (POPIA compliant)',
      'Administrator & facilitator onboarding workshop (4 hours)',
    ],
  },
  {
    id: 'accredited-institution',
    name: 'Accredited Institution & TVET Suite',
    targetAudience: 'SETA/QCTO accredited providers, colleges & mid-sized academies requiring compliance workflows.',
    monthlyZar: 9600,
    turnkeyZar: 54000,
    learnerCapacity: 'Up to 3,000 Active Learners',
    concurrentUsers: '650 Simultaneous Exam Users',
    storageIncluded: '1,000 GB (1 TB) High-Speed Media & POE Storage',
    slaGuarantee: '99.98% Uptime SLA · 24/7 Priority Engineering Support',
    featured: true,
    includedFeatures: [
      'Everything in Starter Academy plus dedicated multi-core cloud cluster',
      'Digital Portfolio of Evidence (POE) rubric grading & moderator portals',
      'Offline mobile progressive web app (PWA) sync for low-data learners',
      'Online student registration & South African payment gateway integration',
      'Automated attendance, time-on-task & SETA/QCTO compliance exports',
    ],
  },
  {
    id: 'enterprise-campus',
    name: 'Enterprise Campus & University Cloud',
    targetAudience: 'Universities, multi-campus colleges, government academies & national corporate L&D ecosystems.',
    monthlyZar: 21500,
    turnkeyZar: 115000,
    learnerCapacity: '10,000+ Active Learners (Unlimited Scaling)',
    concurrentUsers: '2,500+ Simultaneous Exam Users',
    storageIncluded: '5,000 GB (5 TB) Geo-Redundant Storage + CDN',
    slaGuarantee: '99.99% Uptime SLA · Dedicated Account & DevOps Engineer',
    includedFeatures: [
      'High-availability load-balanced server cluster with auto-scaling exam nodes',
      'Two-way integration with Student Information Systems (SIS), ERP & HRIS',
      'Single Sign-On (SSO) via Microsoft Entra ID / Google Workspace',
      'Custom instructional software modules & multi-tenant sub-portals',
      'Full on-site or virtual faculty training + quarterly SEO & enrolment audits',
    ],
  },
];
