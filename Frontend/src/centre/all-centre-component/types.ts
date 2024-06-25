export interface CentreProps {
  id: number;
  name: string;
  address: string;
  district: string;
  openTime: string;
  closeTime: string;
  pricePerHour: number;
  numberOfCourts: number;
  coreImg: string;
  currentRate: number;
}

export interface CentreListProps {
  centres: CentreProps[];
}
