import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MultiSelectDropdown from "../components/MultiSelect";
import {deployAgent} from "../utils/DeployAgent";

const CreateAgentPage = () => {

    const [platformType, setPlatformType] = React.useState("");
    const [agentName, setAgentName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [maxSpend, setMaxSpend] = React.useState("");
    const [selectedTokens,setSelectedTokens] = React.useState([]);
    const [errorMessage,setErrorMessage] = React.useState("");
    
    const handleSubmit = async(e) => {
      e.preventDefault();

      let deployParams={
        platformType: platformType,
        agentName,
        description,
        maxSpend,
        selectedTokens,
      };
    
      try {
    const receipt = await deployAgent(deployParams);
    console.log("Agent successfully deployed!:", receipt);
  } catch (err) {
    console.error("Error deploying agent:", err);
    if (err.code === "INSUFFICIENT_FUNDS") {
        setErrorMessage("Not enough ETH in your wallet to deploy and fund the agent.");
      } else if (err.code === 4001) {
        setErrorMessage("Transaction was rejected by the user.");
      } else {
        setErrorMessage("Something went wrong during deployment.");
      }
  }

    };


  
  return (
    <div className="flex flex-col min-h-screen bg-[#000000] overflow-hidden relative">
      <Navbar />
      <iframe
        src="https://sincere-polygon-333639.framer.app/404-2"
        className="absolute top-0 left-80 w-[150vh] h-[100%] scale-[3.2] z-[0]"
        frameBorder="0"
        allowFullScreen
      />

      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[1200px] h-[200px] bg-[#705fbe] opacity-90 blur-[180px] rounded-full z-0" />

      <div className="absolute bottom-0 md:top-[290px] md:left-[1200px] transform translate-x-[-20%] translate-y-[40%] opacity-70 z-[1]">
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

      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-36 pb-20 relative z-10">
        <div>
          <div className="absolute top-[120px] md:top-[20px] left-[280px] md:left-[1400px] transform translate-x-[-50%] translate-y-[-50%] animate-float opacity-70 z-[-1]">
            <div className="relative">

              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-full relative"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #a855f7, #7c3aed, #5b21b6, #3730a3)',
                  boxShadow: '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                  animation: 'sphereGlow 4s ease-in-out infinite alternate'
                }}
              >

                <div
                  className="absolute top-2 left-2 w-4 h-4 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
                    filter: 'blur(2px)'
                  }}
                />
              </div>

              <div
                className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full"
                style={{
                  background: 'radial-gradient(circle, transparent 40%, rgba(168, 85, 247, 0.3) 70%, transparent 100%)',
                  animation: 'pulseGlow 3s ease-in-out infinite'
                }}
              />

              <div
                className="absolute inset-0 w-32 h-32 md:w-40 md:h-40 rounded-full -translate-x-4 -translate-y-4"
                style={{
                  background: 'radial-gradient(circle, transparent 50%, rgba(168, 85, 247, 0.2) 80%, transparent 100%)',
                  animation: 'pulseGlow 5s ease-in-out infinite reverse'
                }}
              />
            </div>
          </div>

          <div className="absolute top-[120px] md:top-[400px] left-[280px] md:left-[40px] transform translate-x-[-50%] translate-y-[-50%] animate-float opacity-60 z-[-1]">
            <div className="relative">

              <div
                className="w-24 h-24 md:w-32 md:h-32 rounded-full relative"
                style={{
                  background: 'radial-gradient(circle at 30% 30%, #a855f7, #7c3aed, #5b21b6, #3730a3)',
                  boxShadow: '0 0 40px rgba(168, 85, 247, 0.6), 0 0 80px rgba(168, 85, 247, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.1)',
                  animation: 'sphereGlow 4s ease-in-out infinite alternate'
                }}
              >

                <div
                  className="absolute top-2 left-2 w-4 h-4 rounded-full"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, transparent 70%)',
                    filter: 'blur(2px)'
                  }}
                />
              </div>

              <div
                className="absolute inset-0 w-24 h-24 md:w-32 md:h-32 rounded-full"
                style={{
                  background: 'radial-gradient(circle, transparent 40%, rgba(168, 85, 247, 0.3) 70%, transparent 100%)',
                  animation: 'pulseGlow 3s ease-in-out infinite'
                }}
              />

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

        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center leading-tight bg-gradient-to-r from-[white] via-[#ffffff] to-[#ffffff] py-2 text-transparent bg-clip-text opacity-0 animate-slideInLeft delay-[400ms]">
          Create A New Agent
        </h1>
        <p className="text-md md:text-lg text-white/70 mb-10 text-center opacity-0 animate-slideInRight delay-[400ms] max-w-2xl">
          Design, describe and deploy your autonomous agent with ease.
        </p>

        <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-4 bg-white/5 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg ">

          <div>
            <p className=" ml-1 py-4 text-white">Source Type</p>
            <select onChange={(e) => setPlatformType(e.target.value)} required className="w-full bg-transparent text-white placeholder-white/60 px-4 py-4 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition opacity-0 animate-slideInBottom delay-[800ms]">
              <option>Source Type</option>
              <option>Twitter</option>
              <option>Telegram</option>
              <option>Discord</option>
            </select>
          </div>

          <div>
            <p className="ml-1 py-4 text-white">Name Your Agent</p>
            <input onChange={(e) => setAgentName(e.target.value)} required
              type="text"
              placeholder="@agentname"
              className="w-full bg-white/10 backdrop-blur-lg text-white placeholder-white/60 px-4 py-3 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition opacity-0 animate-slideInBottom delay-[800ms]"
            />
          </div>

          <div>
            <p className="ml-1 py-4 text-white">Write a short description</p>
            <textarea onChange={(e) => setDescription(e.target.value)} required
              placeholder="@shortdescription"
              rows={4}
              className="w-full bg-white/10 backdrop-blur-lg text-white placeholder-white/60 px-4 py-3 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 transition opacity-0 animate-slideInBottom delay-[800ms]"
            />
          </div>

          <div className="relative z-50">
            <p className="ml-1 py-4 text-white">Select Token(s)</p>
            <div className="flex flex-col md:flex-row gap-4 transition opacity-0 animate-slideInBottom delay-[800ms] ">
              <MultiSelectDropdown
              selectedTokens={selectedTokens}
              setSelectedTokens={setSelectedTokens}/>
            </div>
          </div>

          <div>
            <p className="ml-1 py-4 text-white">Enter Maximum Spend Amount</p>
            <input onChange={(e) => setMaxSpend(e.target.value)} required
              type="number"
              placeholder="Enter Amount"
              className="w-full bg-white/10 backdrop-blur-lg text-white placeholder-white/60 px-4 py-3 rounded-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400 z-0 transition opacity-0 animate-slideInBottom delay-[800ms]"
            />
          </div>
          <div>
            <label className="flex items-center gap-3 text-white">
              <input type="checkbox" className="accent-purple-500 w-4 h-4" />
              <span>I confirm the above strategy and approve deployment</span>
            </label>
          </div>

          <button type="submit" className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold text-lg py-3 rounded-md transition transform duration-4ms ease-in-out hover:scale-[1.01] hover:shadow-lg opacity-0 animate-slideInBottom delay-[800ms]">
            Deploy Agent
          </button>
          {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
        </form>
      </main>

      <Footer />
    </div>
  );
};

export default CreateAgentPage;
