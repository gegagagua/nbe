import { DebtorRegistryDocumentSamples } from '@/constants/debtor-registry';
import type {
  DebtorRegistryApplication,
  SearchDebtorAppsResponse,
} from '@/types/debtor-registry';

/**
 * UI პრევიუ: სიაში 2–3 ჩანაწერი. API-ს ჩასართავად: `false`.
 */
export const USE_DEBTOR_REGISTRY_LIST_MOCK = true;

const by = (id: number, name: string) => ({ id, name });

const baseApp = (over: Partial<DebtorRegistryApplication> & Pick<DebtorRegistryApplication, 'id'>): DebtorRegistryApplication => ({
  id: over.id,
  createdDate: over.createdDate ?? '2026-04-01T09:00:00',
  createdBy: over.createdBy ?? by(10, 'ნინო მაგალითაძე'),
  regnumber: over.regnumber ?? null,
  regDate: over.regDate ?? '2026-04-02',
  status: over.status ?? { id: 1, name: 'დადასტურებული', active: true },
  statusDate: over.statusDate ?? '2026-04-02T12:00:00',
  statusUser: over.statusUser ?? by(10, 'ნინო მაგალითაძე'),
  trType: over.trType ?? { id: 1, name: 'საბაზისო', active: true },
  caseNo: over.caseNo ?? null,
  caseDate: over.caseDate ?? null,
  caseTrackId: over.caseTrackId ?? null,
  requestedPerson: over.requestedPerson ?? null,
  applicants: over.applicants ?? [],
  downloadUrl: over.downloadUrl ?? null,
});

const rows: DebtorRegistryApplication[] = [
  baseApp({
    id: 91001,
    regnumber: 'DE26062718-004',
    caseNo: 'A26412496',
    caseDate: '2026-03-28T11:00:00',
    requestedPerson: {
      idnumber: '01001001010',
      personName: 'დავით მაგრაძე',
      address: 'თბილისი, საბურთალო',
    },
    applicants: [
      {
        id: 1,
        appId: 91001,
        name: 'სს ბანკი კონსტანტა',
        idnumber: '204542771',
        phone: null,
        address: 'თბილისი',
      },
    ],
    downloadUrl: `${DebtorRegistryDocumentSamples.dummyPdfUrl}#app-91001`,
  }),
  baseApp({
    id: 91002,
    regnumber: 'DE25235504-004',
    caseNo: 'A13034656',
    caseDate: '2026-02-15T08:30:00',
    status: { id: 2, name: 'მიმდინარე', active: true },
    trType: { id: 2, name: 'დამატებითი', active: true },
    requestedPerson: {
      idnumber: '01002002020',
      personName: 'თამარ ნიკოლაური',
      address: 'ბათუმი',
    },
    applicants: [
      {
        id: 2,
        appId: 91002,
        name: 'სახელმწიფო ბიუჯეტი',
        idnumber: '0',
        phone: null,
        address: null,
      },
    ],
    downloadUrl: `${DebtorRegistryDocumentSamples.dummyPdfUrl}#app-91002`,
  }),
  baseApp({
    id: 91003,
    regnumber: 'DE24296128-004',
    caseNo: 'A16037552',
    caseDate: '2026-01-20T14:00:00',
    status: { id: 3, name: 'დასრულებული', active: false },
    requestedPerson: {
      idnumber: '35001112233',
      personName: 'კომპანია ტესტი',
      address: 'ქუთაისი',
    },
    applicants: [
      {
        id: 3,
        appId: 91003,
        name: 'შპს ინვესტორი',
        idnumber: '405012345',
        phone: '+99532222222',
        address: 'თბილისი',
      },
    ],
    downloadUrl: `${DebtorRegistryDocumentSamples.dummyPdfUrl}#app-91003`,
  }),
];

export const DEBTOR_REGISTRY_LAYOUT_MOCK_RESPONSE: SearchDebtorAppsResponse = {
  data: rows,
  page: {
    totalRecords: rows.length,
    totalPages: 1,
    size: 5,
    number: 0,
  },
};
