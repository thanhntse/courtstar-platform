import Feedback from "./feedback";

export interface FeedbackItemProps {
  id: number;
  fullName: string;
  rate: number;
  content: string;
  createDate: string;
}

export interface FeedbackProps {
  listItem: FeedbackItemProps[];
  itemsPerPage: number;
}

export default Feedback;
