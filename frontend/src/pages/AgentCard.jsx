import React from "react";

const AgentCard = ({ agent, index, onClick }) => {
  return (
    <div
      onClick={() => onClick(agent)}
      className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl p-5 hover:shadow-purple-500/30 hover:scale-[1.02]  transition cursor-pointer"
    >
      <span className="text-sm text-white/50 mb-1">#{index + 1}</span>
      <h3 className="text-xl font-semibold text-white mb-1">{agent.name}</h3>
      <p className="text-white/70">{agent.description}</p>
    </div>
  );
};

export default AgentCard;
