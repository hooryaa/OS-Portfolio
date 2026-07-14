/* ============================================================
   HOORIA OS — CONTENT LAYER (real data, sourced from CV + brief)
   Everything a visitor reads lives here. Add a new project,
   blog post, or timeline entry by adding an object below —
   no other file needs to change.
   ============================================================ */

const CONTENT = {

  profile: {
    name: "Hooria Amir",
    firstName: "Hooria",
    initials: "HA",
    role: "Software Engineer • Data Engineer • Data Analyst",
    tagline: "Building end-to-end data products, ETL pipelines, analytics platforms, and AI-assisted tooling.",
    subrole: "Data Engineering · Analytics · Business Intelligence",
    summary: "Software Engineering graduate with hands-on experience designing and shipping data pipelines, analytics products, Power BI reporting, automation tools, and full-stack applications using Python, SQL, PostgreSQL, Power BI, TypeScript, Pandas, and NumPy. Experienced in data extraction, transformation, validation, visualization, API integration, and relational database design. Built projects spanning data engineering, business intelligence, workflow automation, and software development. Open to opportunities in Data Engineering, Data Analytics, and Business Intelligence.",
    location: "Lahore, Pakistan",
    timezone: "GMT+5 (PKT)",
    availability: "Open to Data Engineering, Data Analytics, and Business Intelligence roles",
    focus: "Building data engineering pipelines, analytics platforms, and AI-assisted tooling for smarter workflows.",
    email: "hxhxrix@yahoo.com",
    phone: "+92 310 4296656",
    github: "https://github.com/hooryaa",
    linkedin: "https://linkedin.com/in/hooryaa",
    portfolio: "https://hooria-portfolio.vercel.app",
    resumeFile: "resume.pdf",
    education: {
      degree: "Bachelor of Science in Software Engineering",
      school: "Lahore Garrison University",
      location: "Lahore, Pakistan",
      year: "2026",
      note: "NSCT Score: 91st Percentile"
    }
  },

  about: [
    { year: "2022–2026", title: "Software Engineering at LGU", body: "Completed a B.S. in Software Engineering with a focus on software development, data engineering, and analytics." },
    { year: "2025", title: "Built JobPulse Pakistan", body: "Designed Python ETL pipelines, skill extraction, data validation, and PostgreSQL warehousing for a labor market analytics platform." },
    { year: "2025", title: "Delivered Power BI reporting", body: "Built 15+ KPI dashboards and interactive reports using Power BI, dimensional modeling, and optimized DAX measures." },
    { year: "2025", title: "Built Hadoop big data pipeline", body: "Configured Hadoop HDFS, YARN, and MapReduce in Ubuntu and surfaced results through a Flask analytics dashboard." },
    { year: "2026", title: "Launched DevPilot", body: "Built a VS Code extension using TypeScript, React, Node.js, and the OpenAI API to automate developer workflows inside the editor." }
  ],

  experience: [
    { year: "2026", role: "DevPilot — AI VS Code Extension", body: "Built a developer productivity extension in TypeScript with the VS Code Extension API, React webview UI, OpenAI integration, and a modular message bridge between the webview and the extension host." },
    { year: "2026", role: "JobPulse Pakistan — Labor Market Analytics", body: "Built Python ETL pipelines processing 1,000+ job records across multiple sources with skill extraction, validation, and PostgreSQL/SQLite warehousing, then surfaced hiring trends in Power BI dashboards." },
    { year: "2025", role: "Power BI Analytics Dashboard Suite", body: "Built Power BI dashboards with 15+ KPIs, dimensional modeling, data cleaning, DAX optimization, and interactive reporting for business analytics." },
    { year: "2025", role: "Balochistan Complaint Analytics Platform", body: "Built a Hadoop-based analytics platform using HDFS, MapReduce, and YARN in Ubuntu, and integrated results into a Flask dashboard." }
  ],

  skills: [
    { icon: "▣", title: "Data Engineering", body: "ETL pipelines, data modeling, data transformation, data validation, data quality monitoring, and SQL optimization." },
    { icon: "⛁", title: "Data Analysis", body: "Pandas, NumPy, exploratory data analysis, data visualization, Jupyter Notebook, and Matplotlib." },
    { icon: "◈", title: "Databases", body: "PostgreSQL, Supabase, relational database design, and database normalization." },
    { icon: "▥", title: "Programming", body: "Python, SQL, TypeScript, JavaScript, C++, and PHP." },
    { icon: "⌘", title: "Business Intelligence", body: "Power BI, DAX, Excel, dashboard development, KPI reporting, and business analytics." },
    { icon: "⚙", title: "Software Engineering", body: "REST APIs, API integration, Git/GitHub, OOP, Agile methodologies, SDLC, CI/CD, and system design." }
  ],

  projects: [
    {
      id: "devpilot",
      name: "DevPilot",
      tag: "AI Developer Tooling · Final Year Project",
      glyph: "◆",
      summary: "An AI-powered VS Code extension that automates repetitive development workflows from inside the editor — my flagship final-year project.",
      stack: ["TypeScript", "React", "Node.js", "VS Code Extension API", "OpenAI API", "REST APIs"],
      overview: "DevPilot is a VS Code extension that brings an AI assistant directly into the editor, built with a modern React-based webview UI on top of the VS Code Extension API and Node.js, powered by the OpenAI API. As my Final Year Project, it's the most complete piece of software I've built solo, end to end.",
      problem: "Developers constantly break flow to search documentation, write boilerplate, or context-switch to a browser for AI help — losing the thread of what they were actually building.",
      research: "I studied the VS Code Extension API surface (activation events, webviews, the command palette contribution model) and evaluated how existing AI coding assistants structure their editor integration, to decide where DevPilot's UI should live and how it should talk to the extension host.",
      architecture: "VS Code Extension Host → React-based Webview UI → Node.js service layer → OpenAI API for generation → REST API integrations for extended functionality → workspace file system read/write, all coordinated through a modular message-passing layer between the webview and the host.",
      implementation: "Built the extension host logic and command contributions in TypeScript, with a React app rendered inside a VS Code webview for the interactive UI. A Node.js layer mediates calls to the OpenAI API and any external REST APIs, keeping the webview itself lightweight and fast.",
      challenges: "The hardest part was bridging VS Code's sandboxed webview with a modern React UI — webviews can't directly access the file system or extension APIs, so every interaction has to go through an explicit, serialized message-passing bridge to the extension host, which meant designing that protocol carefully from day one.",
      lessons: "Shipping a solo, full-stack extension end to end forced real engineering discipline — debugging across two separate execution contexts (webview vs. extension host), writing tests I could trust, and keeping Git history and CI/CD clean even on a project with no one else reviewing my code.",
      future: "Planned next steps: multi-file change planning (not just single-file suggestions), local/offline model support as a fallback to the OpenAI API, and usage telemetry to tune which suggestions are actually useful.",
      highlights: [
        { label: "Type", value: "Final Year Project" },
        { label: "Role", value: "Solo developer" },
        { label: "Core stack", value: "TypeScript + React + Node.js" },
        { label: "AI layer", value: "OpenAI API" }
      ],
      demo: "https://marketplace.visualstudio.com/items?itemName=devpilotorg.devpilot-ai-assistant-hooria",
      video: "https://youtu.be/ocs4PCVTKS0",
      github: "https://github.com/hooryaa/DevPilot--Visual-Studio-Code-Extension-for-Beginner-Developers"
    },
    {
      id: "cinelytics",
      name: "CINELYTICS",
      tag: "Data Engineering · Movie Analytics",
      glyph: "▣",
      summary: "A movie analytics platform built around a medallion-style data pipeline — raw data refined in stages down to a machine learning model and dashboard.",
      stack: ["Python", "PostgreSQL", "ETL", "Streamlit", "Power BI", "Machine Learning"],
      overview: "CINELYTICS is one of my strongest data engineering projects: a movie analytics pipeline that moves data through explicit refinement stages — Raw Data → Bronze Layer → Silver Layer → Analytics → ML → Dashboard — rather than jamming transformation and presentation together. The emphasis throughout is on the data engineering, not the UI.",
      problem: "Raw movie datasets arrive messy and inconsistent, and jumping straight from raw data to a dashboard usually means the transformation logic is scattered, undocumented, and hard to trust.",
      research: "I looked at how modern data platforms structure medallion architectures (bronze/silver/gold-style layering) and adapted that pattern to a project-scale pipeline I could build and reason about solo in Python and PostgreSQL.",
      architecture: "Raw Data ingestion → Bronze Layer (raw, minimally-processed storage) → Silver Layer (cleaned, validated, conformed schema) → Analytics layer (aggregation and feature tables) → Machine Learning layer (model training/scoring) → Dashboard layer (Streamlit + Power BI).",
      implementation: "Each layer is a distinct, Python-driven transformation step writing into PostgreSQL, so every stage of the pipeline can be inspected, re-run, and debugged independently instead of being one opaque script. Streamlit powers a fast interactive exploration view; Power BI powers the polished reporting view.",
      challenges: "Keeping the Bronze and Silver layers genuinely separate — resisting the urge to 'just clean it while loading it' — was the real discipline of this project, but it's what made every downstream layer trustworthy and easy to debug in isolation.",
      lessons: "Explicitly layering a pipeline (even solo, even for a portfolio project) pays for itself immediately the first time something breaks — you know exactly which layer to open, instead of re-reading one giant script top to bottom.",
      future: "Planned improvements: incremental/streaming loads instead of full refreshes, automated data quality checks between layers, and model versioning for the ML layer.",
      highlights: [
        { label: "Pipeline", value: "6-stage medallion architecture" },
        { label: "Dashboards", value: "Streamlit + Power BI" },
        { label: "Core stack", value: "Python + PostgreSQL" },
        { label: "Focus", value: "Data engineering over UI" }
      ],
      demo: "https://hooria-portfolio.vercel.app", github: "https://github.com/hooryaa"
    },
    {
      id: "prestige",
      name: "Prestige Properties",
      tag: "Real Estate Intelligence Platform",
      glyph: "◈",
      summary: "A real estate intelligence platform combining map-based property search with market-insight dashboards.",
      stack: ["Next.js", "TypeScript", "Mapbox", "PostgreSQL", "Analytics"],
      overview: "Prestige Properties pairs a map-based property search experience with market-insight dashboards, so exploring listings and understanding the market they sit in happen in one place instead of two.",
      problem: "Property platforms usually separate 'browse listings' from 'understand the market' — buyers get a map, and market data lives in a completely different report, if it exists at all.",
      research: "I looked at what buyers actually want to compare (price trends by area, listing density, relative value) and designed the dashboard layer around those specific questions rather than a generic analytics page.",
      architecture: "Next.js (TypeScript) frontend → API routes → PostgreSQL for listings and market data → Mapbox for geospatial rendering and search → an analytics layer aggregating listings into market-insight views.",
      implementation: "Listings and geospatial data are modeled relationally in PostgreSQL and rendered on an interactive Mapbox map; a separate analytics view aggregates the same underlying data into market-insight dashboards, so both views stay consistent with one source of truth.",
      challenges: "Keeping the map view and the analytics view backed by the same PostgreSQL data — rather than two systems that could drift out of sync — was the main architectural decision I had to get right early.",
      lessons: "A dashboard is only as trustworthy as the query it's built on; investing time in clean relational schema design up front made the market-insight views far easier to build correctly.",
      future: "Planned improvements: saved searches with alerting, and richer time-series market trend views as more historical data accumulates.",
      highlights: [
        { label: "Search", value: "Map-based, Mapbox-powered" },
        { label: "Insights", value: "Market dashboards" },
        { label: "Core stack", value: "Next.js + TypeScript + PostgreSQL" }
      ],
      demo: "https://prestige-properties-sigma.vercel.app/",
      video: "https://youtu.be/6yVQJo_Xm88",
      github: "https://github.com/hooryaa/Prestige-Properties"
    },
    {
      id: "simplewrite",
      name: "SimpleWrite",
      tag: "Desktop App · Offline-First",
      glyph: "✎",
      summary: "A desktop blogging platform built with Electron — rich text editing with full offline support.",
      stack: ["Electron", "React", "SQLite", "PHP backend", "Rich text editing"],
      overview: "SimpleWrite is a desktop blogging application built on Electron with a React front end, designed so writing never depends on a network connection — everything is stored locally in SQLite first, and syncs to a PHP backend when you're online.",
      problem: "Web-based writing tools stop working the moment your connection drops, which is exactly when you don't want to lose a paragraph you just wrote.",
      research: "I compared local-first storage approaches for a desktop Electron app and landed on SQLite as the source of truth on-device, with the PHP backend treated as a sync target rather than the primary store.",
      architecture: "Electron shell → React renderer process (rich text editor UI) → local SQLite database (source of truth) → PHP backend API (sync layer for publishing and backup).",
      implementation: "The rich text editor writes directly to the local SQLite database on every change, so the app is fully usable offline; a background sync process pushes changes to the PHP backend once connectivity is available.",
      challenges: "Designing a sync process that never silently loses a locally-written post — even if the app closes mid-sync — meant treating every sync as resumable and idempotent rather than a one-shot upload.",
      lessons: "Offline-first isn't just 'add a cache' — it means picking the local database as the actual source of truth from day one, and treating the server as downstream rather than the other way around.",
      future: "Planned improvements: conflict resolution UI for edits made on two devices, and Markdown export for posts.",
      highlights: [
        { label: "Platform", value: "Electron desktop app" },
        { label: "Local store", value: "SQLite" },
        { label: "Sync layer", value: "PHP backend" },
        { label: "Mode", value: "Offline-first" }
      ],
      demo: "https://simplewrite.lovestoblog.com",
      video: "https://youtu.be/Pfge5TaqRjY",
      github: "https://github.com/hooryaa/SimpleWrite-blog-platform"
    },
    {
      id: "jobpulse",
      name: "JobPulse Pakistan",
      tag: "Data Engineering & Labor Market Analytics",
      glyph: "⬡",
      summary: "A labor market analytics platform — Python ETL pipelines processing 1,000+ job records into Power BI dashboards on hiring trends.",
      stack: ["Python", "PostgreSQL", "SQL", "Power BI"],
      overview: "JobPulse Pakistan ingests job listings from multiple sources through Python ETL pipelines, extracts and validates skill data, warehouses it in PostgreSQL, and surfaces hiring trends and in-demand technologies through Power BI dashboards.",
      problem: "Job market data in Pakistan is scattered across sources with no unified, queryable view of which skills and roles are actually in demand right now.",
      research: "I evaluated approaches for skill extraction from unstructured job descriptions and for data quality monitoring across a multi-source ingestion pipeline before settling on the ETL design used in production.",
      architecture: "Multi-source job listing ingestion → Python ETL pipelines (extraction, transformation, skill extraction) → data validation & quality monitoring → PostgreSQL/SQLite warehousing → SQL analytics views → Power BI dashboards.",
      implementation: "Built Python ETL pipelines processing 1,000+ job records across multiple sources for automated ingestion, transformation, and loading. Implemented skill extraction, data validation, and quality monitoring, then built SQL analytics views and reporting layers to identify hiring trends, in-demand technologies, and workforce insights, visualized through Power BI.",
      challenges: "Skill extraction from free-text job postings is inherently noisy — getting validation and quality monitoring right so bad extractions didn't quietly poison the analytics layer took real iteration.",
      lessons: "The analytics layer is only as good as the validation step feeding it — I spent more time on data quality monitoring than on the dashboards themselves, and the dashboards were better for it.",
      future: "Planned improvements: expanding source coverage, and a trend-over-time view once enough historical snapshots accumulate.",
      highlights: [
        { label: "Records processed", value: "1,000+ job records" },
        { label: "Pipeline", value: "Multi-source Python ETL" },
        { label: "Warehouse", value: "PostgreSQL / SQLite" },
        { label: "Reporting", value: "Power BI dashboards" }
      ],
      demo: "https://jobpulse-pakistan.streamlit.app/",
      video: "https://youtu.be/j7RKeEzvwmE",
      github: "https://github.com/hooryaa/JobPulse-Pakistan-ETL"
    },
    {
      id: "powerbi",
      name: "Power BI Analytics Dashboard Suite",
      tag: "Business Intelligence",
      glyph: "▥",
      summary: "A decision-ready BI suite focused on KPI reporting, dimensional data modeling, and optimized DAX measures across real business datasets.",
      stack: ["Power BI", "DAX", "ETL", "Data Modeling"],
      overview: "A business intelligence project focused entirely on turning raw datasets into decision-ready dashboards — 15+ KPIs across multiple interactive reporting views, backed by proper dimensional data modeling rather than flat, ad-hoc tables.",
      problem: "Raw business data is rarely dashboard-ready — without a real data model underneath, KPIs are slow, inconsistent, or quietly wrong.",
      research: "I studied dimensional modeling patterns (fact/dimension tables) and DAX performance practices to design measures that would stay fast and accurate as the dataset grew.",
      architecture: "Raw datasets → ETL (cleaning, transformation) → dimensional data model (fact and dimension tables) → DAX measures → interactive Power BI reports.",
      implementation: "Built Power BI dashboards containing 15+ KPIs and interactive reporting views, using ETL workflows, dimensional data modeling, and DAX calculations. Performed data cleaning, transformation, and modeling to convert raw datasets into actionable business insights, and optimized DAX measures for both performance and analytical accuracy.",
      challenges: "Getting DAX measures to stay both fast and correct as filters and slicers combine in unexpected ways required rewriting several measures around proper context transition rather than quick-fix formulas.",
      lessons: "A dimensional model is worth building even for a 'small' BI project — every KPI became simpler to write and faster to render once the fact/dimension structure was in place.",
      future: "Planned improvements: row-level security for multi-team access, and incremental refresh for larger datasets.",
      highlights: [
        { label: "KPIs", value: "15+" },
        { label: "Modeling", value: "Dimensional (fact/dimension)" },
        { label: "Focus", value: "Optimized DAX measures" }
      ],
      demo: null,
      video: "https://youtu.be/zu4I3rUAazE",
      github: "https://github.com/hooryaa/PowerBI--ETL-DAX-Data-Modelling"
    },
    {
      id: "balochistan",
      name: "Balochistan Complaint Analytics",
      tag: "Big Data · Hadoop Ecosystem",
      glyph: "⌗",
      summary: "A Big Data analytics platform on a real Hadoop HDFS/MapReduce/YARN cluster, surfaced through a Flask dashboard.",
      stack: ["Hadoop HDFS", "MapReduce", "YARN", "Ubuntu Linux", "Flask", "Python", "Pandas"],
      overview: "This project processes complaint data at scale using an actual Hadoop ecosystem — HDFS for storage, MapReduce for distributed processing, and YARN for resource management — configured inside a virtualized Ubuntu Linux environment, with results surfaced through a Flask web dashboard.",
      problem: "Complaint datasets at government scale are too large and unwieldy for single-machine processing to stay fast or reliable.",
      research: "I set up and configured a Hadoop ecosystem from scratch in a virtualized Linux environment to understand HDFS storage and YARN resource management first-hand, rather than only through managed cloud tooling.",
      architecture: "Raw complaint data → HDFS (distributed storage) → MapReduce jobs (distributed processing) → YARN (resource/job management) → Flask web application → interactive dashboards.",
      implementation: "Configured and managed Hadoop ecosystem components (HDFS, YARN) in a virtualized Ubuntu Linux environment, wrote MapReduce jobs, and built a Flask application to integrate Hadoop-processed output into interactive HTML/CSS/JS dashboards.",
      challenges: "Getting HDFS and YARN correctly configured and talking to each other inside a virtualized Linux setup — with no managed cloud abstraction to hide the plumbing — was the steepest part of the learning curve.",
      lessons: "Running the actual Hadoop ecosystem yourself, instead of a managed equivalent, makes distributed systems concepts like data locality and resource scheduling concrete instead of theoretical.",
      future: "Planned improvements: migrating batch MapReduce jobs to a Spark-based pipeline for faster iteration.",
      highlights: [
        { label: "Cluster", value: "HDFS + MapReduce + YARN" },
        { label: "Environment", value: "Virtualized Ubuntu Linux" },
        { label: "Dashboard", value: "Flask web app" }
      ],
      demo: null,
      video: null,
      github: "https://github.com/hooryaa/Hadoop-Balochistan-Complaint-Web-Portal"
    }
  ],

  architectures: [
    {
      id: "cinelytics-medallion",
      label: "CINELYTICS Pipeline",
      nodes: [
        { x: 20, y: 140, w: 130, label: "Raw Data", sub: "unprocessed movie data", cls: "", detail: "Unmodified movie data as it lands — box-office numbers, metadata, and review text, in whatever shape the source gives it." },
        { x: 190, y: 140, w: 130, label: "Bronze Layer", sub: "raw storage", cls: "", detail: "Raw data written to PostgreSQL with almost no transformation — the append-only source of truth if anything downstream needs to be rebuilt." },
        { x: 360, y: 140, w: 130, label: "Silver Layer", sub: "cleaned, validated", cls: "accent", detail: "Cleaned, validated, and schema-conformed. Duplicate titles resolved, types coerced, nulls handled — the first layer anything else is allowed to trust." },
        { x: 530, y: 140, w: 130, label: "Analytics", sub: "aggregation tables", cls: "accent", detail: "Aggregation and feature tables built from Silver — the numbers a dashboard or model actually queries, precomputed instead of recalculated live." },
        { x: 700, y: 60, w: 120, label: "ML Layer", sub: "training / scoring", cls: "accent2", detail: "Model training and scoring for box-office / sentiment prediction, reading from the Analytics layer so it never touches raw data directly." },
        { x: 700, y: 220, w: 150, label: "Dashboard", sub: "Streamlit + Power BI", cls: "accent2", detail: "Streamlit for fast interactive exploration, Power BI for the polished reporting view — both reading the same trusted Analytics tables." }
      ]
    },
    {
      id: "jobpulse-etl",
      label: "JobPulse ETL",
      nodes: [
        { x: 30, y: 140, w: 150, label: "Job Sources", sub: "multiple boards", cls: "", detail: "Job listings pulled from multiple sources — inconsistent formats, duplicate postings, and free-text descriptions to untangle." },
        { x: 220, y: 60, w: 150, label: "Extraction", sub: "Python ETL", cls: "", detail: "Python ETL jobs normalize each source into one common schema before anything else happens to the data." },
        { x: 220, y: 220, w: 160, label: "Skill Extraction", sub: "NLP-style parsing", cls: "", detail: "Parses free-text job descriptions to pull out structured skills — the noisiest, most iterated-on part of the whole pipeline." },
        { x: 440, y: 140, w: 160, label: "Validation & QA", sub: "quality monitoring", cls: "accent", detail: "Every extracted record is validated before it's trusted — this is where most of the engineering time actually went." },
        { x: 660, y: 140, w: 160, label: "Warehouse", sub: "PostgreSQL/SQLite", cls: "accent", detail: "The 1,000+ validated job records are warehoused here, queryable by SQL analytics views for trend reporting." },
        { x: 880, y: 140, w: 150, label: "Power BI", sub: "hiring trend dashboards", cls: "accent2", detail: "Hiring trends, in-demand technologies, and workforce insights — the payoff view built on top of everything above." }
      ]
    },
    {
      id: "devpilot-ext",
      label: "DevPilot Extension",
      nodes: [
        { x: 30, y: 140, w: 160, label: "Extension Host", sub: "activation events", cls: "", detail: "The VS Code process that activates DevPilot and owns all file system and API access — nothing in the webview can bypass it." },
        { x: 260, y: 60, w: 160, label: "React Webview UI", sub: "in-editor interface", cls: "", detail: "A sandboxed React app rendered inside VS Code — no direct file system or extension API access, by design." },
        { x: 260, y: 220, w: 160, label: "Message Bridge", sub: "host ↔ webview", cls: "", detail: "An explicit, serialized message-passing protocol — the only way the webview and extension host talk to each other." },
        { x: 500, y: 140, w: 160, label: "Node.js Service", sub: "mediation layer", cls: "accent", detail: "Mediates calls to the OpenAI API and any external REST APIs, keeping the webview lightweight." },
        { x: 740, y: 140, w: 160, label: "OpenAI API", sub: "generation", cls: "accent2", detail: "Handles generation and suggestions based on prompts assembled from editor context." },
        { x: 970, y: 140, w: 160, label: "Workspace FS", sub: "read/write", cls: "", detail: "The only place file reads and writes happen — always through the extension host, never directly from the webview." }
      ]
    },
    {
      id: "powerbi-model",
      label: "Power BI Data Model",
      nodes: [
        { x: 30, y: 140, w: 150, label: "Raw Datasets", sub: "source data", cls: "", detail: "Source data before modeling — inconsistent types, duplicate rows, and broken dates are expected." },
        { x: 230, y: 140, w: 130, label: "ETL", sub: "clean + transform", cls: "", detail: "Cleaning and transformation pass — the unglamorous work that makes every KPI downstream trustworthy." },
        { x: 400, y: 60, w: 150, label: "Fact Tables", sub: "measures", cls: "accent", detail: "The measurable events at the center of the star schema — the numbers reports actually query." },
        { x: 400, y: 220, w: 160, label: "Dimension Tables", sub: "context", cls: "accent", detail: "The who/what/when context tables that make fact-table numbers filterable and meaningful." },
        { x: 630, y: 140, w: 150, label: "DAX Measures", sub: "optimized calcs", cls: "accent2", detail: "DAX calculations rewritten around proper context transition instead of ad-hoc quick fixes." },
        { x: 840, y: 140, w: 160, label: "Reports", sub: "15+ KPIs", cls: "", detail: "The interactive reports end users actually open — fast because the data model was built first." }
      ]
    },
    {
      id: "hadoop-arch",
      label: "Hadoop Big Data",
      nodes: [
        { x: 30, y: 140, w: 150, label: "Complaint Data", sub: "raw ingestion", cls: "", detail: "Raw complaint records at a scale too large for comfortable single-machine processing." },
        { x: 230, y: 140, w: 130, label: "HDFS", sub: "distributed storage", cls: "accent", detail: "Distributed storage across the cluster — configured by hand in Ubuntu without managed plumbing." },
        { x: 410, y: 60, w: 150, label: "MapReduce", sub: "distributed processing", cls: "accent", detail: "Distributed jobs transform raw HDFS data into usable analytics output." },
        { x: 410, y: 220, w: 130, label: "YARN", sub: "resource mgmt", cls: "accent", detail: "Resource scheduling and job management across the cluster — the part that made data locality concrete." },
        { x: 620, y: 140, w: 150, label: "Flask App", sub: "integration", cls: "accent2", detail: "Integrates Hadoop-processed output into a standard web application layer." },
        { x: 830, y: 140, w: 160, label: "Dashboards", sub: "HTML/CSS/JS", cls: "", detail: "The dashboards end users interact with — the visible payoff for the big data pipeline." }
      ]
    }
  ],

  blog: [
    {
      id: "layer-your-pipeline",
      title: "Why I stopped cleaning data while I load it",
      date: "2026-06-02",
      readTime: "5 min",
      body: "Building CINELYTICS around an explicit Bronze/Silver/Analytics layering felt like overhead at first — why not just clean the data on the way in? The first time a downstream number looked wrong, I understood why: I could open exactly one layer and know precisely what it was responsible for, instead of re-reading one long script top to bottom. Layering a pipeline is really about making failure cheap to diagnose."
    },
    {
      id: "validation-before-dashboards",
      title: "The dashboard is the easy part",
      date: "2026-04-11",
      readTime: "4 min",
      body: "On JobPulse Pakistan, I expected the Power BI dashboards to take the most time. They didn't — validating and quality-monitoring the skill extraction from messy job postings did. A pretty chart built on unvalidated data is just a confident-looking lie, and that lesson changed how much time I now budget for data quality before I ever open a BI tool."
    },
    {
      id: "webview-bridge",
      title: "What building an editor extension taught me about boundaries",
      date: "2026-02-20",
      readTime: "6 min",
      body: "DevPilot's React UI lives in a VS Code webview, which is sandboxed away from the file system and the extension APIs entirely. Every single interaction has to cross an explicit message-passing bridge to the extension host. Designing that protocol early — rather than patching it in later — turned out to be the single decision that made the rest of the extension maintainable."
    },
    {
      id: "hadoop-by-hand",
      title: "Configuring Hadoop by hand made distributed systems click",
      date: "2025-12-08",
      readTime: "5 min",
      body: "It's one thing to read about HDFS replication and YARN scheduling; it's another to configure both yourself in a virtualized Ubuntu environment with nothing managed hiding the details. Getting the Balochistan Complaint Analytics platform running end to end made concepts like data locality and resource contention concrete in a way no lecture slide had."
    }
  ]
};
