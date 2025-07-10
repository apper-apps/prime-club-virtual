import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return { variant: "default", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" };
      case "contacted":
        return { variant: "default", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" };
      case "connected":
        return { variant: "default", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" };
      case "locked":
        return { variant: "default", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" };
      case "meeting booked":
        return { variant: "default", color: "bg-orange-500/10 text-orange-400 border-orange-500/20" };
      case "meeting done":
        return { variant: "default", color: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" };
      case "negotiation":
        return { variant: "default", color: "bg-pink-500/10 text-pink-400 border-pink-500/20" };
      case "qualified":
        return { variant: "default", color: "bg-green-500/10 text-green-400 border-green-500/20" };
      case "proposal":
        return { variant: "default", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
      case "closed":
        return { variant: "default", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
      case "lost":
        return { variant: "default", color: "bg-red-500/10 text-red-400 border-red-500/20" };
      default:
        return { variant: "default", color: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
    }
  };

  const { color } = getStatusConfig(status);

  return (
    <Badge className={`border ${color}`}>
      {status}
    </Badge>
  );
};

export default StatusBadge;