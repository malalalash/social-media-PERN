import { formatDistanceToNow } from "date-fns";

export const dateFormat = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};
