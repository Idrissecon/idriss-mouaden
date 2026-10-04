export const profile = {
  location: "Córdoba, Spain",
  role: "High-school student, independent researcher, and investment analyst",
  introduction:
    "High-school student, independent researcher, and investment analyst interested in banking, financial institutions, financial analysis, business strategy, and economics.",
  fields: ["Banking & finance", "Financial analysis", "Business strategy", "Economics", "Political economy", "Mathematics"],
  education: {
    programme: "High school education",
    expected: 2028,
  },
  currentResearch: {
    title: "Bank liquidity and contingent funding capacity",
    description:
      "Research on how bank liquidity differs from the conventional marketability of assets, and how collateral eligibility, encumbrance, haircuts, pre-positioning, and access to funding channels shape the liquidity a bank can obtain under stress.",
  },
  recognition: {
    title: "High Commendation · 2026 Global Essay Prize",
    organisation: "John Locke Institute",
    work: "Cashlessness and Monetary Discretion",
  },
  experience: {
    organisation: "BYCIG",
    role: "Investment Analyst",
    startYear: 2026,
    description:
      "Researches public companies, analyses financial statements and regulatory filings, and prepares investment proposals and reports.",
  },
  activities: [
    "Two provincial school debate competitions",
    "European Parliament simulation",
  ],
  orcid: "https://orcid.org/0009-0007-7001-022X",
  contactEmail: "idriss@idrissmouaden.com",
} as const;

export const cvDocumentHref: string | null = "/documents/idriss-mouaden-academic-cv.pdf";
export const cvHref = cvDocumentHref ?? "/cv";
