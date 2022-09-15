import dayjs from 'dayjs/esm';

export interface IStoreAlert {
  id: number;
  storeName?: string | null;
  storeStatus?: string | null;
  timestamp?: dayjs.Dayjs | null;
}

export type NewStoreAlert = Omit<IStoreAlert, 'id'> & { id: null };
