import DynamicPriorityPage from "@/components/DynamicPriorityPage";
import { Priority } from "@/state/api";

const Urgent = () => {
  return <DynamicPriorityPage priority={Priority.Medium} />;
};

export default Urgent;
