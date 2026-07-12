export const profile = {
  location: "Spain",
  role: "High school student and independent researcher",
  introduction:
    "Economics student and independent researcher working on banking, financial systems, and monetary institutions.",
  fields: ["Economics", "Banking & finance", "Political economy", "Mathematics"],
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
    title: "2026 Global Essay Prize shortlist",
    organisation: "John Locke Institute",
    work: "Cashlessness and Monetary Discretion",
  },
  experience: {
    organisation: "BYCIG",
    role: "Investment Analyst",
    startYear: 2026,
    description:
      "Researches public companies and prepares investment proposals as an active member of the organisation.",
  },
  activities: [
    "Two provincial school debate competitions",
    "European Parliament simulation",
  ],
  orcid: "https://orcid.org/0009-0007-7001-022X",
  contactEmail: "idriss@idrissmouaden.com",
  contactPhone: {
    display: "+34 612 20 55 08",
    href: "tel:+34612205508",
  },
} as const;

// Set this to the public PDF path when the final CV is supplied.
export const cvDocumentHref: string | null = null;
export const cvHref = cvDocumentHref ?? "/cv";
