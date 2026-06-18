export type CaseDetailCreditorParty = {
  titleLine: string;
  addressLines: string[];
  paymentIdentifier: string;
};

export type CaseDetailCreditorRow = {
  party: CaseDetailCreditorParty;
  representative: CaseDetailCreditorParty | null;
};

export type CaseDetailDebtorRow = {
  titleLine: string;
  addressLines: string[];
  paymentIdentifier: string;
};

export type CaseDetailWritRow = { court: string; orderNo: string; orderDate: string };
export type CaseDetailClaimRow = { amount: string; creditorsCell: string; debtorsCell: string };
export type CaseDetailProceedingDoc = { title: string; actor: string; href: string };
export type CaseDetailProceedingStatus = {
  codeLine: string;
  title: string;
  dateTime: string;
  documents: CaseDetailProceedingDoc[];
  /** Identifiers used to fetch downloadable files for this status. */
  appStatusId?: number;
  appId?: number;
};

/** A downloadable file attached to a proceeding status. */
export type CaseDetailProceedingFile = {
  fileId: number;
  title: string;
  fileName: string;
  mimeType: string;
  uploadedBy: string;
  createdDate: string;
};

export type CaseDetailSearchPropertyRow = {
  nameObject: string;
  plateOrExtra?: string;
  orderRef: string;
  orderAction: string;
  initiator: string;
  initiatorWhen: string;
};

export type CaseDetailSearchMiaBlock = {
  foundProperty: CaseDetailSearchPropertyRow[];
  restrictionsPlaceholder: string;
};

export type CaseDetailSocialRow = {
  nameId: string;
  addressPhone: string;
  sent: string;
  receivedAt: string;
  status: string;
  vulnerable: string;
};

export type CaseDetailBusinessNotifyRow = {
  debtor: string;
  initiator: string;
  createdAt: string;
  sent: string;
  response: string;
  soleProp: string;
};

export type CaseDetailBusinessShareRow = {
  owner: string;
  title: string;
  orgNo: string;
  regDate: string;
  share: string;
  status: string;
};

export type CaseDetailAuctionStage = {
  type: string;
  startDate: string;
  endDate: string;
  eaucUrl: string;
};

export type CaseDetailAuctionLot = {
  lotNo: string;
  category: string;
  name: string;
  price: string;
  winDate: string;
  url: string;
  stages: CaseDetailAuctionStage[];
};

export type CaseDetailFundsPartyBlock = { title: string; bodyLines: string[] };

export type CaseDetailInstallmentPayment = {
  paymentDate: string;
  amountToPay: string;
  amountPayed: string;
  remainedAmount: string;
  status: string;
  confirmedBy: string;
  confirmDate: string;
};

export type CaseDetailInstallment = {
  installmentId: number;
  headerLine: string;
  partyLine: string;
  status: string;
  payments: CaseDetailInstallmentPayment[];
};

export type CaseDetailContactBlock = {
  bureau: string;
  address: string;
  phone: string;
  email: string;
  fax: string;
  website: string;
};

export type CaseDetailData = {
  officialCaseNo: string;
  bureauLines: string[];
  categoryRight: string;
  creditors: CaseDetailCreditorRow[];
  debtors: CaseDetailDebtorRow[];
  writRows: CaseDetailWritRow[];
  claimsSummary: string;
  claimRows: CaseDetailClaimRow[];
  proceedings: CaseDetailProceedingStatus[];
  searchMiaCreditor: CaseDetailSearchMiaBlock;
  searchMiaDebtor: CaseDetailSearchMiaBlock;
  socialRows: CaseDetailSocialRow[];
  businessNotify: CaseDetailBusinessNotifyRow[];
  businessShares: CaseDetailBusinessShareRow[];
  fundsSummaryLines: string[];
  fundsCreditor: CaseDetailFundsPartyBlock;
  fundsDebtor: CaseDetailFundsPartyBlock;
  auctionLots: CaseDetailAuctionLot[];
  installmentNote: string;
  contact: CaseDetailContactBlock;
};
