import DynamicPriorityPage from "@/components/DynamicPriorityPage";
import { Priority } from "@/state/api";

const Urgent = () => {
  return <DynamicPriorityPage priority={Priority.High} />;
};

export default Urgent;
