import Calendar from "./Calendar";



export interface Item {
  key: any;
  label: string
}

export interface BookingDetail {
  date: string;
  slotId: string | number;
  courtId: string | number
}

export interface CalendarProps {
  typeOfCalendar: 'booking' | 'manage';
  centre: any;
  handleButton: (formCalendar: any) => void
}

export interface CalendarHeaderProps {
  yearItems: Item[];
  handleSelectYear: (item: Item | null) => void;
  weekItems: Item[];
  currentWeekIndex: number;
  handleSelectWeek: (item: Item | null) => void;
  courtItems: Item[];
  handleSelectCourt: (item: Item | null) => void;
  goPrevious: () => void;
  goNext: () => void;
  typeOfCalendar: 'booking' | 'manage';
  formCalendar: any;
  handleButton: (formCalendar: any) => void;
  handleReset: () => void;
  handleWeeklyBooking: (number: number, status: boolean) => void;
  existSelection: boolean
}

export interface Slot {
  slotNo: number;
  startTime: string;
  endTime: string;
  id: number;
}

export interface CalendarTableProps {
  centre: any;
  selectedWeek: string[];
  isDisable: (day: string, slot: Slot) => boolean;
  handleClick: (slot: Slot, day: string) => void;
  formCalendar: any;
  loading: boolean
}

export default Calendar;
