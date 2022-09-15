import dayjs from 'dayjs/esm';
import { StoreStatus } from 'app/entities/enumerations/store-status.model';

export interface IStore {
  id: number;
  name?: string | null;
  address?: string | null;
  status?: StoreStatus | null;
  createTimestamp?: dayjs.Dayjs | null;
  updateTimestamp?: dayjs.Dayjs | null;
}

export type NewStore = Omit<IStore, 'id'> & { id: null };
