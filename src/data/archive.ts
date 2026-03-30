import type { DayEntry } from "./types";

// Archive: stories from previous days (moves here at midnight Amman time)
export const archive: DayEntry[] = [
  {
    date: "2026-03-29",
    displayDate: "Mar 29, 2026",
    ideas: [
      {
        title: "AI therapist matching based on voice analysis",
        description: "An app that analyzes vocal biomarkers during intake calls to match patients with therapists whose communication style best fits their needs, improving retention rates by 40%.",
        sourceEvent: "Researchers find vocal biomarkers can predict onset of clinical depression",
        sourceUrl: "https://www.bbc.com/news/health-voice-analysis-mental-health-685210",
        tag: "Health",
      },
      {
        title: "Hyperlocal frost alerts for urban gardeners",
        description: "Push notifications with block-level frost predictions for city gardeners, integrated with smart irrigation systems to automatically protect sensitive plants overnight.",
        sourceEvent: "Unpredictable spring frost patterns devastate urban community gardens",
        sourceUrl: "https://www.cnn.com/2024/03/29/weather/urban-farming-frost-damage/index.html",
        tag: "Weather",
      },
      {
        title: "AI referee second-opinion SaaS for leagues",
        description: "A computer vision platform that provides instant replay analysis and officiating recommendations to amateur and semi-pro leagues that can't afford full VAR systems.",
        sourceEvent: "Controversial VAR calls in European soccer lead to fan protests and tech scrutiny",
        sourceUrl: "https://www.espn.com/soccer/story/_/id/39832041/var-controversy-calls-for-independent-audit",
        tag: "Sports",
      },
      {
        title: "AI menu optimizer for ghost kitchens",
        description: "An analytics platform that uses delivery app data, local demographics, and ingredient costs to dynamically suggest optimal menu items for virtual restaurant brands.",
        sourceEvent: "Ghost kitchens pivot to data-driven menus as inflation squeezes profit margins",
        sourceUrl: "https://www.forbes.com/sites/food/2024/03/29/ghost-kitchen-optimization-trends-inflation/",
        tag: "Food",
      },
      {
        title: "AI-powered script coverage for indie filmmakers",
        description: "Affordable AI script analysis that provides studio-quality coverage reports — character arcs, pacing issues, market comparisons — to independent filmmakers in minutes.",
        sourceEvent: "Hollywood studios cut entry-level script readers, leaving indies in limbo",
        sourceUrl: "https://www.hollywoodreporter.com/business/business-news/studios-lay-off-creative-execs-12358620/",
        tag: "Film",
      },
      {
        title: "AI stem-splitting for sample clearance automation",
        description: "A tool that isolates individual stems from existing tracks and automatically initiates clearance requests with rights holders, streamlining the sampling process for producers.",
        sourceEvent: "Copyright disputes surge as hip-hop producers struggle with legal stem clearing",
        sourceUrl: "https://www.rollingstone.com/music/music-news/sample-clearance-legal-bottleneck-hip-hop-123499421/",
        tag: "Music",
      },
      {
        title: "AR museum layer for historical context overlays",
        description: "An AR app that overlays historical photos, audio narratives, and 3D reconstructions onto museum exhibits, bringing static artifacts to life with rich contextual storytelling.",
        sourceEvent: "Museum attendance drops as younger audiences demand interactive digital experiences",
        sourceUrl: "https://www.artnews.com/art-news/news/museum-trends-digital-interaction-gen-z-123470123/",
        tag: "Culture",
      },
      {
        title: "AI fabric sustainability scoring at checkout",
        description: "A browser extension that instantly scores the environmental impact of clothing items while shopping online, factoring in material sourcing, manufacturing, and shipping.",
        sourceEvent: "New regulations to require transparency labels for every garment sold in EU",
        sourceUrl: "https://www.voguebusiness.com/sustainability/eu-fashion-regulations-transparency-labelling-laws/",
        tag: "Fashion",
      },
      {
        title: "Orbital debris tracking API for satellite insurers",
        description: "A real-time API that provides collision risk scores for active satellites, enabling insurance companies to dynamically price coverage based on current orbital conditions.",
        sourceEvent: "Collision near-miss in Low Earth Orbit sparks fears for commercial satellites",
        sourceUrl: "https://www.space.com/satellite-collision-risk-leo-debris-tracking-2024",
        tag: "Space",
      },
      {
        title: "AI pet emotion detection via webcam analysis",
        description: "A home camera app that uses computer vision to detect signs of anxiety, boredom, or distress in pets while owners are away, sending real-time alerts with suggested actions.",
        sourceEvent: "Ethologists develop AI model capable of identifying stress signals in domestic cats",
        sourceUrl: "https://www.nationalgeographic.com/animals/article/ai-decodes-pet-emotions-2024",
        tag: "Pets",
      },
      {
        title: "Visa processing automation for digital nomads",
        description: "An AI-powered service that handles multi-country visa applications, tracks expiration dates, and suggests optimal travel routes to maintain legal residency status.",
        sourceEvent: "Digital nomad visa applications triple, overwhelming consulate staff worldwide",
        sourceUrl: "https://www.cnbc.com/2024/03/29/digital-nomad-visa-backlogs-remote-work-trends.html",
        tag: "Travel",
      },
      {
        title: "Peer-to-peer EV charging from home solar panels",
        description: "A platform that lets homeowners with solar panels and EV chargers rent out their charging spots to nearby EV drivers, creating a distributed charging network.",
        sourceEvent: "Public charging networks fail to keep pace with EV adoption rates",
        sourceUrl: "https://www.washingtonpost.com/business/2024/03/29/ev-charging-infrastructure-shortage/",
        tag: "Cars",
      },
      {
        title: "AI bias detector for political ad spending",
        description: "A transparency tool that analyzes political ad targeting data across platforms, exposing demographic biases and dark money patterns to journalists and watchdog groups.",
        sourceEvent: "Deepfake political ads flooded social media during local elections",
        sourceUrl: "https://www.cnn.com/2024/03/29/politics/ai-deepfakes-political-ads-analysis/index.html",
        tag: "Politics",
      },
      {
        title: "Lab equipment rental marketplace for startups",
        description: "A peer-to-peer marketplace where universities and established labs rent idle equipment to biotech startups, reducing the capital barrier for early-stage research.",
        sourceEvent: "Biotech startups stall as lab space and equipment costs reach new highs",
        sourceUrl: "https://www.wsj.com/articles/biotech-startup-funding-lab-equipment-costs-1164856000",
        tag: "Science",
      },
      {
        title: "AI tax-loss harvesting for micro-portfolios",
        description: "Automated tax-loss harvesting for portfolios under $10K, making a strategy previously reserved for wealthy investors accessible to everyday retail traders.",
        sourceEvent: "Retail investors seek sophisticated tools as commission-free trading matures",
        sourceUrl: "https://www.cnbc.com/2024/03/29/retail-trading-tax-optimization-tools.html",
        tag: "Money",
      },
    ],
    previousIdeas: {
      Health: [
        { title: "Wearable hydration coach for elderly patients", description: "A smart wristband that monitors skin turgor and sweat composition to send hydration reminders to elderly users and alert caregivers to early signs of dehydration.", sourceEvent: "Dehydration-related hospitalizations among seniors rise 15% this year", sourceUrl: "https://www.reuters.com/business/healthcare-pharmaceuticals/senior-dehydration-rates-climb-2024-03-28/", tag: "Health" },
        { title: "Gut microbiome subscription testing kit", description: "Monthly at-home gut tests that track microbiome changes over time and provide personalized probiotic and dietary recommendations based on longitudinal data.", sourceEvent: "Long-term study links gut bacteria diversity to immune system resilience", sourceUrl: "https://www.nytimes.com/2024/03/27/well/eat/gut-microbiome-health.html", tag: "Health" },
      ],
      Weather: [
        { title: "Storm-chaser marketplace for media outlets", description: "A real-time marketplace connecting licensed storm chasers with news networks, enabling instant licensing of extreme weather footage with built-in rights management.", sourceEvent: "News outlets struggle to acquire high-res footage of record tornado season", sourceUrl: "https://www.theguardian.com/media/2024/mar/28/storm-chasing-footage-demand-surges", tag: "Weather" },
        { title: "Weather-indexed crop insurance for smallholders", description: "Parametric insurance that auto-pays farmers when satellite-verified weather thresholds are breached, eliminating claims paperwork for small-scale operations.", sourceEvent: "Small-scale farmers in developing nations face insurance gap as climate risks rise", sourceUrl: "https://www.wsj.com/articles/agricultural-insurance-gap-climate-change-africa-1164831200", tag: "Weather" },
      ],
      Sports: [
        { title: "Youth athlete burnout detection wearable", description: "A wearable for young athletes that tracks training load, sleep quality, and stress markers to alert coaches and parents before overtraining leads to injury or burnout.", sourceEvent: "Rising injury rates in youth sports attributed to year-round training burnout", sourceUrl: "https://www.apnews.com/article/youth-sports-injuries-burnout-study-mar-28-2024", tag: "Sports" },
      ],
      Food: [
        { title: "Allergen-scanning smart fork for dining out", description: "A portable utensil with a built-in spectrometer that detects common allergens in food within seconds, giving diners with severe allergies confidence when eating out.", sourceEvent: "Food allergy incidents in restaurants reach record highs following staff shortages", sourceUrl: "https://www.cnbc.com/2024/03/28/food-allergy-safety-concerns-rising-in-dining-out.html", tag: "Food" },
      ],
      Film: [
        { title: "Virtual location scouting with satellite imagery", description: "A platform combining satellite feeds, street-level imagery, and AR previews so directors can scout filming locations remotely before committing to travel.", sourceEvent: "Rising travel costs force indie filmmakers to seek remote production solutions", sourceUrl: "https://www.variety.com/2024/film/news/indie-budget-cuts-travel-scouting-123595420/", tag: "Film" },
      ],
      Music: [
        { title: "Live concert dynamic pricing via demand sensing", description: "Real-time ticket pricing that adjusts based on social media buzz, weather, and competing events, helping venues maximize revenue while filling seats.", sourceEvent: "Ticket sales platforms face backlash over static pricing during sudden demand spikes", sourceUrl: "https://www.billboard.com/pro/concert-ticket-pricing-disparity-dynamic-fees-analysis/", tag: "Music" },
      ],
      Culture: [
        { title: "Oral history preservation via AI transcription", description: "A service that records, transcribes, and indexes oral histories from elder community members, creating searchable cultural archives for future generations.", sourceEvent: "Historical societies warn of 'vanishing history' as the WWII generation passes away", sourceUrl: "https://www.smithsonianmag.com/history/oral-history-preservation-urgency-2024-03-28/", tag: "Culture" },
      ],
      Fashion: [
        { title: "Digital wardrobe NFTs tied to physical garments", description: "Each physical garment comes with a digital twin NFT that tracks provenance, care history, and resale value — creating a verified secondary market for luxury fashion.", sourceEvent: "Luxury brands experiment with digital twins to curb counterfeit resale market", sourceUrl: "https://www.businessoffashion.com/news/technology/luxury-nfts-physical-verification-innovation/", tag: "Fashion" },
      ],
      Space: [
        { title: "Space tourism medical clearance platform", description: "An online medical screening and training platform that certifies civilians for suborbital flights, partnering with space tourism operators for pre-flight preparation.", sourceEvent: "Health concerns raised over long-term effects of suborbital flight on elderly tourists", sourceUrl: "https://www.nature.com/articles/space-medicine-tourism-screening-2024", tag: "Space" },
      ],
      Pets: [
        { title: "On-demand pet cremation and memorial service", description: "A dignified end-of-life service for pets with at-home pickup, private cremation, and customizable memorial packages including ash art and digital tribute pages.", sourceEvent: "Pandemic-era pet owners now facing end-of-life care decisions for older rescues", sourceUrl: "https://www.usatoday.com/story/news/nation/2024/03/28/pet-end-of-life-care-services/73129840/", tag: "Pets" },
      ],
      Travel: [
        { title: "Local SIM delivery service at arrivals gate", description: "Pre-order a local SIM card online and have it hand-delivered to you at the airport arrivals gate, already activated with your preferred data plan.", sourceEvent: "International travelers report exorbitant roaming fees after airport kiosk closures", sourceUrl: "https://www.nytimes.com/2024/03/28/travel/international-roaming-charges-tips.html", tag: "Travel" },
      ],
      Cars: [
        { title: "AI dashcam insurance discount verifier", description: "A dashcam app that uses AI to score driving behavior and automatically submits verified safe-driving data to insurers to unlock premium discounts.", sourceEvent: "Insurers demand video evidence for claims as premiums skyrocket", sourceUrl: "https://www.forbes.com/advisor/car-insurance/dash-cam-discounts-trend-2024/", tag: "Cars" },
      ],
      Politics: [
        { title: "Constituent sentiment dashboard for local reps", description: "A real-time dashboard aggregating social media, town hall feedback, and survey data to give local representatives a clear picture of constituent priorities.", sourceEvent: "Local representatives report disconnectedness from younger constituent priorities", sourceUrl: "https://www.theguardian.com/politics/2024/mar/28/local-government-youth-engagement-gap", tag: "Politics" },
      ],
      Science: [
        { title: "Citizen science data quality verification layer", description: "An AI-powered quality assurance layer that validates citizen science submissions, scoring data reliability and flagging anomalies before they enter research databases.", sourceEvent: "Unverified citizen science data leads to retracted biodiversity study", sourceUrl: "https://www.wired.com/story/citizen-science-data-verification-needs-2024/", tag: "Science" },
      ],
      Money: [
        { title: "Real-time tariff impact calculator for importers", description: "A tool that instantly calculates how new tariffs affect landed costs for specific products, helping small importers reprice inventory before margins evaporate.", sourceEvent: "New tariff announcements catch small importers off guard with overnight cost increases", sourceUrl: "https://www.reuters.com/business/tariff-impact-small-importers-2024-03-28/", tag: "Money" },
      ],
    },
  },
];
