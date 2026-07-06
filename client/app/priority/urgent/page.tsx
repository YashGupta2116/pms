import DynamicPriorityPage from "@/components/DynamicPriorityPage";
import { Priority } from "@/state/api";

const Urgent = () => {
  return <DynamicPriorityPage priority={Priority.Urgent} />;
};

export default Urgent;
