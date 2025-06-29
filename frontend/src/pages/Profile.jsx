import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AgentControlBox from "../components/AgentCardBox";
import AgentCard from "./AgentCard";

const ProfilePage = () => {
    const [agents, setAgents] = useState([
        { id: 1, name: "Agent 1", description: "Scans exchanges for ETH price differences", paused: false },
        { id: 2, name: "Agent 2", description: "Monitors DeFi pools", paused: true },
    ]);
    const [selectedAgent, setSelectedAgent] = useState(null);

    const toggleAgentPause = (id) => {
        setAgents((prev) =>
            prev.map((agent) =>
                agent.id === id ? { ...agent, paused: !agent.paused } : agent
            )
        );
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#000000] overflow-hidden relative">
            <Navbar />

            <div className="absolute bottom-0 left-[10px] md:left-[1350px] transform translate-x-[-20%] animate-float translate-y-[40%] opacity-70 z-[1]">
                <div className="relative">
                    <div
                        className="w-80 h-80 rounded-full relative"
                        style={{
                            background: 'radial-gradient(circle at 30% 30%, #a855f7, #7c3aed, #5b21b6, #3730a3)',
                            boxShadow: '0 0 100px rgba(168, 85, 247, 0.8), 0 0 200px rgba(168, 85, 247, 0.4), inset 0 0 60px rgba(255, 255, 255, 0.1)',
                            animation: 'sphereGlow 4s ease-in-out infinite alternate'
                        }}
                    >
                        <div
                            className="absolute top-8 left-8 w-16 h-16 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
                                filter: 'blur(4px)'
                            }}
                        />
                        <div
                            className="absolute top-12 left-12 w-8 h-8 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 80%)',
                                filter: 'blur(2px)'
                            }}
                        />
                    </div>
                    <div
                        className="absolute inset-0 w-80 h-80 rounded-full animate-pulse"
                        style={{
                            background: 'radial-gradient(circle, transparent 40%, rgba(168, 85, 247, 0.3) 70%, transparent 100%)',
                            animation: 'pulseGlow 3s ease-in-out infinite'
                        }}
                    />
                    <div
                        className="absolute inset-0 w-96 h-96 rounded-full -translate-x-8 -translate-y-8"
                        style={{
                            background: 'radial-gradient(circle, transparent 0%, rgba(168, 85, 247, 0.2) 80%, transparent 100%)',
                            animation: 'pulseGlow 5s ease-in-out infinite reverse'
                        }}
                    />
                </div>
            </div>

            <iframe
                src="https://sincere-polygon-333639.framer.app/404-2"
                className="absolute top-0 left-40 w-[150vw] h-[150vh] scale-[1.2] z-[0]"
                frameBorder="0"
                allowFullScreen
            />

            <main className="flex-grow flex items-center justify-center pt-32 pb-20 relative z-10 px-4">
                <div className="absolute top-[120px] md:top-[80px] left-[280px] md:left-[850px] transform translate-x-[-50%] animate-float translate-y-[-50%] opacity-80 z-[-1]">
                    <div className="relative">
                        {/* Main small sphere */}
                        <div
                            className="w-24 h-24 md:w-32 md:h-32 rounded-full relative"
                            style={{
                                background: 'radial-gradient(circle at 30% 30%, #a855f7, #7c3aed, #5b21b6, #3730a3)',
                                boxShadow: '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                                animation: 'sphereGlow 4s ease-in-out infinite alternate'
                            }}
                        >
                            {/* Inner highlight */}
                            <div
                                className="absolute top-2 left-2 w-4 h-4 rounded-full"
                                style={{
                                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
                                    filter: 'blur(2px)'
                                }}
                            />
                        </div>

                        {/* Outer glow rings */}
                        <div
                            className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, transparent 40%, rgba(168, 85, 247, 0.3) 70%, transparent 100%)',
                                animation: 'pulseGlow 3s ease-in-out infinite'
                            }}
                        />

                        {/* Larger outer glow */}
                        <div
                            className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 rounded-full -translate-x-4 -translate-y-4"
                            style={{
                                background: 'radial-gradient(circle, transparent 50%, rgba(168, 85, 247, 0.2) 80%, transparent 100%)',
                                animation: 'pulseGlow 5s ease-in-out infinite reverse'
                            }}
                        />
                    </div>
                </div>
                <div className="w-full max-w-6xl bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl p-20 text-white shadow-xl flex flex-col md:flex-row gap-10">

                    <div className="flex flex-col items-center md:items-start text-center md:text-center ml-4 gap-2 md:w-1/3">
                        <img
                            src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=avatar"
                            alt="Profile Avatar"
                            className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                        />
                        <h2 className="text-4xl font-bold text-center pt-2 pb-4 bg-white text-transparent bg-clip-text">
                            Username
                        </h2>
                        <div className="mt-2 bg-white text-black px-4 py-2 rounded-md text-sm inline-block">
                            0x8kqr...FNUo
                        </div>
                        <a
                            href="https://etherscan.io/address/0x8kqr...FNUo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 text-sm py-4 underline hover:text-purple-300"
                        >
                            View on Etherscan ↗
                        </a>
                    </div>

                    <div className="flex-1 space-y-8 ml-8 text-white/90 text-[20px] text-sm">
                        {/*
                        <div>
                            <h3 className="text-[30px] font-semibold text-purple-300 mb-4 ">Bio</h3>
                            <p className="leading-relaxed transition opacity-0 animate-slideInBottom delay-[400ms]">
                                This is your AI trader profile. Customize it to personalize your
                                trading agent and public identity. Others may view this on public leaderboards.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[30px] font-semibold text-purple-300 mb-4 ">Preferences</h3>
                            <ul className="list-disc list-inside leading-relaxed transition opacity-0 animate-slideInBottom delay-[400ms]">
                                <li>Execution Mode: Manual</li>
                                <li>Preferred Networks: Ethereum, Arbitrum</li>
                                <li>Favourite Pairs: ETH/USDC, BTC/ETH</li>
                            </ul>
                        </div> */}

                        <div>
                            <h3 className="text-[30px] font-semibold pt-8 text-purple-300 mb-10 ">Your Agents</h3>
                            {agents.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6">
                                    {agents.map((agent, index) => (
                                        <AgentCard
                                            key={agent.id}
                                            index={index}
                                            agent={agent}
                                            onClick={setSelectedAgent}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-white/60">No agents created yet.</p>
                            )}

                            {selectedAgent && (
                                <>
                                    <div className="fixed inset-0 bg-black/30 backdrop-blur-md z-[999]" />
                                    <AgentControlBox
                                        agent={selectedAgent}
                                        onClose={() => setSelectedAgent(null)}
                                        onTogglePause={toggleAgentPause}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </main >

            <Footer />
        </div >
    );
};

export default ProfilePage;
