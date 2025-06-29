import React, { useState } from "react";

const AgentControlBox = ({ agent, onClose, onTogglePause }) => {
  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">

      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[200px] transition-all duration-300"
        onClick={onClose}
      />
      
      <div className="relative z-10 w-[90%] max-w-md bg-[#070311]/80 border border-white/30 backdrop-blur-[32px] text-white p-8 rounded-2xl shadow-2xl animate-slideInBottom">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[28px] font-bold">{agent.name}</h2>
          <button onClick={onClose} className="text-white hover:text-red-400 text-[24px]">&times;</button>
        </div>

        <p className="text-white/70 text-sm mb-6">{agent.description}</p>

        <div className="flex items-center justify-between mb-8">
          <span className="text-lg">Status:</span>
          <div
            onClick={() => onTogglePause(agent.id)}
            className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer ${
              agent.paused ? "bg-red-500" : "bg-green-500"
            }`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform ${
                agent.paused ? "" : "translate-x-7"
              }`}
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="text-sm block mb-2">Add Funds</label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full px-4 py-2 mb-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
          />
          <button className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition">Add Funds</button>
        </div>

        <div>
          <label className="text-sm block mb-2">Withdraw Funds</label>
          <input
            type="number"
            placeholder="Enter amount"
            className="w-full px-4 py-2 mb-3 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          />
          <button className="w-full bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition">Withdraw Funds</button>
        </div>
      </div>
    </div>
  );
};

export default AgentControlBox;
