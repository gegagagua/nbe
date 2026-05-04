import type { CaseApplication } from "@/types/case-management";

export const CASE_LIST_LAYOUT_MOCK_ROWS_EN_B: CaseApplication[] = [
  {
    id: 2263621,
    inputDate: "2026-01-16T10:00:00",
    regnumber: "A26263558",
    regDate: "2026-01-16",
    finalRegistrationAt: "2026-01-16T10:12:00",
    statusDate: "2026-01-31T21:38:00",
    status: { id: 4, name: "Request Withdrawn", colorCode: "#e67e22" },
    trType: {
      id: 4,
      prefix: "01/1",
      name: "Revocation of Ownership",
    },
    listSequenceLabel: "01/1",
    enforcementBureauName: "Tbilisi Enforcement Bureau",
    footerStatusLine: "Request Withdrawn 31.01.2026 21:38",
    executorLine: "Enf.: default (T. Meladze)",
    cardAccentColor: "#e67e22",
    creditors: [
      {
        id: 401,
        firstName: "Tamar",
        lastName: "Lomidze",
        organization: null,
        idnumber: "35001112233",
      },
      {
        id: 402,
        firstName: "Zurab",
        lastName: "Chincharadze",
        organization: null,
        idnumber: "34002223344",
      },
    ],
    debtors: [
      {
        id: 403,
        firstName: "Nino",
        lastName: "Kartveli",
        organization: null,
        idnumber: "62002054321",
      },
      {
        id: 404,
        firstName: "Lasha",
        lastName: "Japaridze",
        organization: null,
        idnumber: "61001099887",
      },
    ],
  },
  {
    id: 2263622,
    inputDate: "2026-04-01T14:20:00",
    regnumber: "A00445566",
    regDate: "2026-04-01",
    finalRegistrationAt: "2026-04-01T14:25:00",
    statusDate: "2026-04-05T09:00:00",
    status: { id: 5, name: "Enforcement Stage", colorCode: "#2b436c" },
    trType: {
      id: 5,
      prefix: "03/5",
      name: "Claim for Excess Amount",
    },
    listSequenceLabel: "03/5",
    enforcementBureauName: "Rustavi Enforcement Bureau",
    footerStatusLine: "Enforcement Stage 05.04.2026 09:00",
    executorLine: "Enf.: S. Chokhonelidze",
    creditors: [
      {
        id: 501,
        firstName: null,
        lastName: null,
        organization: 'Bank "Design"',
        idnumber: "405012399",
      },
    ],
    debtors: [
      {
        id: 502,
        firstName: "Davit",
        lastName: "Samkharadze",
        organization: null,
        idnumber: "01005556677",
      },
    ],
  },
];
