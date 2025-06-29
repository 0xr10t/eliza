import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TradeHistoryPage = () => {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setTrades([
                {
                    tokenIn: "ETH",
                    tokenOut: "USDC",
                    amountIn: "0.5",
                    amountOut: "1750",
                },
                {
                    tokenIn: "BTC",
                    tokenOut: "ETH",
                    amountIn: "0.1",
                    amountOut: "1.4",
                },
                {
                    tokenIn: "MATIC",
                    tokenOut: "USDT",
                    amountIn: "100",
                    amountOut: "62",
                },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-[#000000] overflow-hidden relative">
            <Navbar />

            <iframe
                src="https://sincere-polygon-333639.framer.app/404-2"
                className="absolute top-0 left-40 w-[150vw] h-[150vh] scale-[1.2] z-[0]"
                frameBorder="0"
                allowFullScreen
            />

            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[500px] h-[200px] bg-purple-300 opacity-50 blur-[180px] rounded-full z-0" />

            <div className="absolute bottom-[500px] left-[1400px] transform translate-x-[-20%] translate-y-[40%] opacity-80 z-[1]">
                <div className="relative">
                    {/* Main sphere */}
                    <div
                        className="w-80 h-80 rounded-full relative"
                        style={{
                            background: 'radial-gradient(circle at 30% 30%, #a855f7, #7c3aed, #5b21b6, #3730a3)',
                            boxShadow: '0 0 100px rgba(168, 85, 247, 0.8), 0 0 200px rgba(168, 85, 247, 0.4), inset 0 0 60px rgba(255, 255, 255, 0.1)',
                            animation: 'sphereGlow 4s ease-in-out infinite alternate'
                        }}
                    >
                        {/* Inner highlight */}
                        <div
                            className="absolute top-8 left-8 w-16 h-16 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
                                filter: 'blur(4px)'
                            }}
                        />

                        {/* Surface reflections */}
                        <div
                            className="absolute top-12 left-12 w-8 h-8 rounded-full"
                            style={{
                                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, transparent 80%)',
                                filter: 'blur(2px)'
                            }}
                        />
                    </div>

                    {/* Outer glow rings */}
                    <div
                        className="absolute inset-0 w-80 h-80 rounded-full animate-pulse"
                        style={{
                            background: 'radial-gradient(circle, transparent 40%, rgba(168, 85, 247, 0.3) 70%, transparent 100%)',
                            animation: 'pulseGlow 3s ease-in-out infinite'
                        }}
                    />

                    {/* Larger outer glow */}
                    <div
                        className="absolute inset-0 w-96 h-96 rounded-full -translate-x-8 -translate-y-8"
                        style={{
                            background: 'radial-gradient(circle, transparent 0%, rgba(168, 85, 247, 0.2) 80%, transparent 100%)',
                            animation: 'pulseGlow 5s ease-in-out infinite reverse'
                        }}
                    />
                </div>
            </div>

            <main className="flex-grow flex flex-col items-center justify-start pt-36 pb-20 px-6 z-10 relative w-full">

                <div>
                    <div className="absolute top-[120px] md:top-[20px] left-[280px] md:left-[520px] transform translate-x-[-50%] animate-float translate-y-[-50%] opacity-50 z-[-1]">
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
                    <div className="absolute top-[120px] md:top-[700px] left-[280px] md:left-[1200px] transform translate-x-[-50%] animate-float translate-y-[-50%] opacity-70 z-[-1]">
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
                </div>

                <h1 className="text-4xl md:text-6xl font-bold mb-6 py-1 text-center leading-tight bg-gradient-to-r from-[white] via-[#ffffff] to-[#ffffff] text-transparent bg-clip-text opacity-0 animate-slideInTop delay-[400ms]">
                    Trade History Table
                </h1>

                {loading ? (
                    <div className="text-white/70 text-lg">Loading trade history...</div>
                ) : trades.length === 0 ? (
                    <div className="text-white/70 text-lg">No trades available.</div>
                ) : (
                    <div className="w-full max-w-5xl mt-10 bg-[#170720]/50 backdrop-blur-md border border-white/30 rounded-2xl py-8 mb-4 shadow-lg  text-white overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-white/10 text-[20px] py-20">
                                <tr>
                                    <th className="py-3 px-5">Token In</th>
                                    <th className="py-3 px-4">Token Out</th>
                                    <th className="py-3 px-5">Amount In</th>
                                    <th className="py-3 px-4">Amount Out</th>
                                </tr>
                            </thead>
                            <tbody>
                                {trades.map((trade, i) => (
                                    <tr
                                        key={i}
                                        className="border-t text-[16px] border-white/10 hover:bg-white/10 transition"
                                    >
                                        <td className="py-3 px-5">{trade.tokenIn}</td>
                                        <td className="py-3 px-4">{trade.tokenOut}</td>
                                        <td className="py-3 px-5">{trade.amountIn}</td>
                                        <td className="py-3 px-4">{trade.amountOut}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default TradeHistoryPage;
