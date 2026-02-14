import { useState, useEffect, useCallback, useRef } from "react";

// ─── South African Animals Data with AI Images ───
const SA_ANIMALS = [
  { 
    name: "Elephant", 
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/6jcgk/gradio_api/file=/tmp/gradio/33e5dee18985bd02f1fec677623adbf5c8358495196df755959cbeb7d25b60ab/image.webp",
    color: "#8B8589", 
    nameZU: "Indlovu", 
    nameAF: "Olifant" 
  },
  { 
    name: "Lion", 
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/6jcgk/gradio_api/file=/tmp/gradio/71d13fbcddbabc89c9bf435fd0d593cbf51eacfafc45b2c5c08a4df7c3a3c0a0/image.webp",
    color: "#C4873A", 
    nameZU: "Ibhubesi", 
    nameAF: "Leeu" 
  },
  { 
    name: "Zebra", 
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/6jcgk/gradio_api/file=/tmp/gradio/a9506d6f57344f7b8fe2799ddd246861852b19ba915a1e396cfd17eb1c3634b7/image.webp",
    color: "#2D2D2D", 
    nameZU: "Idube", 
    nameAF: "Sebra" 
  },
  { 
    name: "Giraffe", 
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/6jcgk/gradio_api/file=/tmp/gradio/7bc4317dcc4075fa40002ff1aed84b6a94a449a2152d5b2b6f426b538a5aa7e4/image.webp",
    color: "#D4A543", 
    nameZU: "Indlulamithi", 
    nameAF: "Kameelperd" 
  },
  { 
    name: "Hippo", 
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/6jcgk/gradio_api/file=/tmp/gradio/697801b346f1e7a61c342e7abfc79bad8e11218a94419ebf2b4b648a96649938/image.webp",
    color: "#7B6B8D", 
    nameZU: "Imvubu", 
    nameAF: "Seekoei" 
  },
  { 
    name: "Rhino", 
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/6jcgk/gradio_api/file=/tmp/gradio/de16e9969a9fc2fffcbbe8c7b9dac324b86167900ea07f200fd48171b949fd8b/image.webp",
    color: "#7A7A7A", 
    nameZU: "Ubhejane", 
    nameAF: "Renoster" 
  },
  { 
    name: "Flamingo", 
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/6jcgk/gradio_api/file=/tmp/gradio/813df04be66d94c8f7c3322137f445a3b59564530824ee7e156eb16c86832c88/image.webp",
    color: "#FF69B4", 
    nameZU: "Iflamingo", 
    nameAF: "Flamink" 
  },
  { 
    name: "Parrot", 
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/6jcgk/gradio_api/file=/tmp/gradio/beab98d6c97a4f6eec3728dfb5f3807dde26c8d88367f30fbd988d82c535796d/image.webp",
    color: "#2ECC71", 
    nameZU: "Iparothi", 
    nameAF: "Papegaai" 
  },
  { 
    name: "Turtle", 
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/6jcgk/gradio_api/file=/tmp/gradio/9aabfd1ccea8993d480609d9ccdc3722cac46be5307af8fd02734a95416397f9/image.webp",
    color: "#4A7A4A", 
    nameZU: "Ufudu", 
    nameAF: "Skilpad" 
  },
  { 
    name: "Butterfly", 
    image: "https://mcp-tools-z-image-turbo.hf.space/--replicas/6jcgk/gradio_api/file=/tmp/gradio/987e1e727c12d0c9ae4913abf73daf3e25d48350a660ca11a9e32d5f2f2d6224/image.webp",
    color: "#9B59B6", 
    nameZU: "Ivemvane", 
    nameAF: "Skoenlapper" 
  },
];

// ─── Difficulty Levels ───
const LEVELS = [
  { name: "Easy", range: [1, 3], stars: "⭐" },
  { name: "Medium", range: [1, 5], stars: "⭐⭐" },
  { name: "Hard", range: [1, 10], stars: "⭐⭐⭐" },
];

// ─── Language Options ───
const LANGUAGES = { EN: "English", AF: "Afrikaans", ZU: "isiZulu" };

const NUMBER_WORDS = {
  EN: ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"],
  AF: ["", "Een", "Twee", "Drie", "Vier", "Vyf", "Ses", "Sewe", "Agt", "Nege", "Tien"],
  ZU: ["", "Kunye", "Kubili", "Kuthathu", "Kune", "Kuhlanu", "Isithupha", "Isikhombisa", "Isishiyagalombili", "Isishiyagalolunye", "Ishumi"],
};

// ─── Encouragement Messages ───
const ENCOURAGEMENT = {
  EN: ["Great job! 🌟", "You're amazing! ✨", "Wonderful counting! 🎉", "You did it! 🏆", "Super star! ⭐"],
  AF: ["Goed gedoen! 🌟", "Jy is amazing! ✨", "Wonderlike tel! 🎉", "Jy het dit gedoen! 🏆", "Super ster! ⭐"],
  ZU: ["Wenze kahle! 🌟", "Umuhle! ✨", "Ukubala okuhle! 🎉", "Wenzile! 🏆", "Inkanyezi! ⭐"],
};

const TRY_AGAIN = {
  EN: "Let's count together! Try again 💪",
  AF: "Kom ons tel saam! Probeer weer 💪",
  ZU: "Ake sibale ndawonye! Zama futhi 💪",
};

// ─── Floating Animal Component ───
function FloatingAnimal({ animal, index, total, onClick }) {
  const positions = [];
  const cols = Math.min(total, 5);
  const rows = Math.ceil(total / cols);

  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const colsInRow = row === rows - 1 ? total - row * cols : cols;
    const xOffset = (cols - colsInRow) * 60;
    positions.push({
      x: xOffset + col * 120 + 20,
      y: row * 130 + 20,
    });
  }

  const pos = positions[index] || { x: 50, y: 50 };
  const delay = index * 0.1;

  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        width: "90px",
        height: "90px",
        cursor: "pointer",
        animation: `bounceIn 0.5s ${delay}s both, float 3s ${delay}s ease-in-out infinite`,
        filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
        transition: "transform 0.2s",
        userSelect: "none",
      }}
      onMouseEnter={(e) => (e.target.style.transform = "scale(1.2)")}
      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
    >
      <img 
        src={animal.image} 
        alt={animal.name}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          borderRadius: "8px",
          background: "rgba(255,255,255,0.1)",
        }}
        onError={(e) => {
          // Fallback to emoji if image fails to load
          e.target.style.display = "none";
          e.target.parentNode.innerHTML = animal.emoji || "🐾";
          e.target.parentNode.style.fontSize = "72px";
          e.target.parentNode.style.display = "flex";
          e.target.parentNode.style.alignItems = "center";
          e.target.parentNode.style.justifyContent = "center";
        }}
      />
    </div>
  );
}

// ─── Number Button ───
function NumberButton({ number, onClick, disabled, isCorrect, isWrong, lang }) {
  const word = NUMBER_WORDS[lang]?.[number] || "";

  return (
    <button
      onClick={() => onClick(number)}
      disabled={disabled}
      style={{
        width: "72px",
        height: "72px",
        borderRadius: "50%",
        border: "3px solid",
        borderColor: isCorrect ? "#2ECC71" : isWrong ? "#E74C3C" : "#E8D5B7",
        background: isCorrect
          ? "linear-gradient(135deg, #2ECC71, #27AE60)"
          : isWrong
          ? "linear-gradient(135deg, #E74C3C, #C0392B)"
          : "linear-gradient(135deg, #FFF8E7, #F5E6C8)",
        color: isCorrect || isWrong ? "white" : "#5D4E37",
        fontSize: "24px",
        fontWeight: "800",
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: isCorrect ? "scale(1.15)" : isWrong ? "scale(0.9)" : "scale(1)",
        boxShadow: isCorrect
          ? "0 0 20px rgba(46,204,113,0.5)"
          : isWrong
          ? "0 4px 8px rgba(231,76,60,0.3)"
          : "0 4px 12px rgba(0,0,0,0.1)",
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2px",
        lineHeight: 1,
      }}
    >
      <span>{number}</span>
      <span style={{ fontSize: "9px", fontWeight: "600", opacity: 0.7 }}>{word}</span>
    </button>
  );
}

// ─── Celebration Overlay ───
function Celebration({ message }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(255,255,255,0.85)",
        borderRadius: "24px",
        zIndex: 100,
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          textAlign: "center",
          animation: "popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div style={{ fontSize: "64px", marginBottom: "12px" }}>🎉</div>
        <div
          style={{
            fontSize: "28px",
            fontWeight: "800",
            color: "#5D4E37",
            fontFamily: "'Fredoka', 'Nunito', sans-serif",
          }}
        >
          {message}
        </div>
      </div>
    </div>
  );
}

// ─── Progress Bar ───
function ProgressBar({ current, total }) {
  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            width: "28px",
            height: "8px",
            borderRadius: "4px",
            background: i < current
              ? "linear-gradient(90deg, #F39C12, #E67E22)"
              : "rgba(93,78,55,0.15)",
            transition: "all 0.3s ease",
          }}
        />
      ))}
    </div>
  );
}

// ─── Main Game ───
export default function CountingAnimalsGame() {
  const [gameState, setGameState] = useState("menu"); // menu | playing | celebration | complete
  const [level, setLevel] = useState(0);
  const [lang, setLang] = useState("EN");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [totalRounds] = useState(5);
  const [currentAnimal, setCurrentAnimal] = useState(null);
  const [targetCount, setTargetCount] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [celebration, setCelebration] = useState("");
  const [streak, setStreak] = useState(0);
  const [animalsCounted, setAnimalsCounted] = useState(0);

  const generateRound = useCallback(() => {
    const [min, max] = LEVELS[level].range;
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const animal = SA_ANIMALS[Math.floor(Math.random() * SA_ANIMALS.length)];
    setCurrentAnimal(animal);
    setTargetCount(count);
    setSelectedAnswer(null);
    setIsCorrect(null);
  }, [level]);

  const startGame = (selectedLevel) => {
    setLevel(selectedLevel);
    setScore(0);
    setRound(0);
    setStreak(0);
    setAnimalsCounted(0);
    setGameState("playing");
  };

  useEffect(() => {
    if (gameState === "playing") {
      generateRound();
    }
  }, [gameState, generateRound]);

  const handleAnswer = (answer) => {
    if (gameState === "celebration") return;
    
    setSelectedAnswer(answer);
    const correct = answer === targetCount;
    setIsCorrect(correct);
    setAnimalsCounted(prev => prev + targetCount);

    if (correct) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setCelebration(ENCOURAGEMENT[lang][Math.floor(Math.random() * ENCOURAGEMENT[lang].length)]);
      setGameState("celebration");
      
      setTimeout(() => {
        if (round < totalRounds - 1) {
          setRound(prev => prev + 1);
          setGameState("playing");
        } else {
          setGameState("complete");
        }
      }, 1500);
    } else {
      setStreak(0);
      setTimeout(() => {
        setIsCorrect(null);
        setSelectedAnswer(null);
      }, 1500);
    }
  };

  const [min, max] = LEVELS[level]?.range || [1, 3];
  const numberOptions = [];
  const correctAnswer = targetCount;
  
  // Add correct answer
  numberOptions.push(correctAnswer);
  
  // Add distractors
  while (numberOptions.length < 4) {
    const distractor = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!numberOptions.includes(distractor)) {
      numberOptions.push(distractor);
    }
  }
  
  // Shuffle array
  for (let i = numberOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numberOptions[i], numberOptions[j]] = [numberOptions[j], numberOptions[i]];
  }

  // ─── Menu Screen ───
  if (gameState === "menu") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FFF8E1 0%, #FFECB3 30%, #C8E6C9 70%, #A5D6A7 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        padding: "16px",
      }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
          @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          @keyframes bounceIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
          @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
          * { box-sizing: border-box; margin: 0; padding: 0; }
        `}</style>

        <div style={{
          background: "rgba(255,255,255,0.9)",
          borderRadius: "24px",
          padding: "32px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        }}>
          {/* Header */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#5D4E37",
              marginBottom: "8px",
              animation: "float 3s ease-in-out infinite",
            }}>
              {lang === "ZU" ? "Bala Izilwane!" : lang === "AF" ? "Tel die Diere!" : "Count the Animals!"}
            </h1>
            <p style={{ fontSize: "16px", color: "#8B7355", fontWeight: "500" }}>
              🇿🇦 NovaLearning · {lang === "ZU" ? "Izilwane zaseNingizimu Afrika" : lang === "AF" ? "Suid-Afrikaanse Diere" : "South African Animals"}
            </p>
          </div>

          {/* Language Selector */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "14px", color: "#8B7355", marginBottom: "12px", fontWeight: "600" }}>
              {lang === "ZU" ? "Khetha ulimi:" : lang === "AF" ? "Kies taal:" : "Choose Language:"}
            </p>
            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
              {Object.entries(LANGUAGES).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => setLang(code)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "12px",
                    border: lang === code ? "2px solid #F39C12" : "2px solid transparent",
                    background: lang === code ? "rgba(243,156,18,0.1)" : "rgba(139,115,85,0.05)",
                    color: "#5D4E37",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s ease",
                  }}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Level Selection */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {LEVELS.map((levelData, index) => (
              <button
                key={index}
                onClick={() => startGame(index)}
                style={{
                  width: "100%",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "none",
                  background: `linear-gradient(135deg, ${index === 0 ? '#2ECC71, #27AE60' : index === 1 ? '#F39C12, #E67E22' : '#E74C3C, #C0392B'})`,
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "700",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  animation: "float 3s ease-in-out infinite",
                  animationDelay: `${index * 0.2}s`,
                }}
                onMouseEnter={(e) => (e.target.style.transform = "translateY(-2px) scale(1.02)")}
                onMouseLeave={(e) => (e.target.style.transform = "translateY(0) scale(1)")}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span>{levelData.stars} {levelData.name}</span>
                  <span style={{ fontSize: "14px", opacity: 0.8 }}>
                    {lang === "ZU" ? `Kubala ${levelData.range[0]}-${levelData.range[1]}` : 
                     lang === "AF" ? `Tel ${levelData.range[0]}-${levelData.range[1]}` : 
                     `Count ${levelData.range[0]}-${levelData.range[1]}`}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={{ 
            marginTop: "24px", 
            fontSize: "12px", 
            color: "#8B7355", 
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }}>
            <span>🐾</span>
            <span>{lang === "ZU" ? "Funda ngokujabulisa!" : lang === "AF" ? "Leer met pret!" : "Learn with Joy!"}</span>
            <span>🌟</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── Complete Screen ───
  if (gameState === "complete") {
    const percentage = Math.round((score / totalRounds) * 100);
    const starRating = percentage >= 80 ? 3 : percentage >= 60 ? 2 : 1;
    
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #FFF8E1 0%, #FFECB3 30%, #C8E6C9 70%, #A5D6A7 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Fredoka', 'Nunito', sans-serif",
        padding: "16px",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.9)",
          borderRadius: "24px",
          padding: "32px",
          maxWidth: "480px",
          width: "100%",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
          position: "relative",
        }}>
          {/* Celebration Animation */}
          <div style={{ fontSize: "72px", marginBottom: "16px", animation: "bounce 1s ease infinite" }}>
            {starRating === 3 ? "🏆" : starRating === 2 ? "🥈" : "🥉"}
          </div>

          <h1 style={{
            fontSize: "32px",
            fontWeight: "800",
            color: "#5D4E37",
            marginBottom: "8px",
          }}>
            {lang === "ZU" ? "Uphothule!" : lang === "AF" ? "Voltooi!" : "Well Done!"}
          </h1>

          <div style={{ 
            fontSize: "48px", 
            fontWeight: "800", 
            color: "#F39C12",
            marginBottom: "16px"
          }}>
            {score}/{totalRounds}
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ 
              fontSize: "24px", 
              marginBottom: "8px"
            }}>
              {"⭐".repeat(starRating)}{"☆".repeat(3 - starRating)}
            </div>
            <p style={{ fontSize: "16px", color: "#8B7355", fontWeight: "600" }}>
              {percentage}% {lang === "ZU" ? "Kungcono!" : lang === "AF" ? "Korrek!" : "Correct!"}
            </p>
          </div>

          {/* Stats */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "24px",
          }}>
            <div style={{
              background: "rgba(46,204,113,0.1)",
              borderRadius: "12px",
              padding: "12px",
            }}>
              <div style={{ fontSize: "24px" }}>🐾</div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#2ECC71" }}>{animalsCounted}</div>
              <div style={{ fontSize: "11px", color: "#8B7355" }}>Animals Counted</div>
            </div>
            <div style={{
              background: "rgba(243,156,18,0.1)",
              borderRadius: "12px",
              padding: "12px",
            }}>
              <div style={{ fontSize: "24px" }}>🔥</div>
              <div style={{ fontSize: "20px", fontWeight: "700", color: "#F39C12" }}>{LEVELS[level].name}</div>
              <div style={{ fontSize: "11px", color: "#8B7355" }}>Difficulty</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => { setRound(0); setScore(0); setStreak(0); setAnimalsCounted(0); setGameState("playing"); }}
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: "16px",
                border: "none",
                background: "linear-gradient(135deg, #2ECC71, #27AE60)",
                color: "white",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {lang === "ZU" ? "Phinda" : lang === "AF" ? "Weer" : "Play Again"}
            </button>
            <button
              onClick={() => setGameState("menu")}
              style={{
                flex: 1,
                padding: "16px",
                borderRadius: "16px",
                border: "2px solid #E8D5B7",
                background: "white",
                color: "#5D4E37",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {lang === "ZU" ? "Imenyu" : lang === "AF" ? "Kieslys" : "Menu"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Game Screen ───
  const animalName = lang === "ZU" ? currentAnimal?.nameZU : lang === "AF" ? currentAnimal?.nameAF : currentAnimal?.name;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #FFF8E1 0%, #FFECB3 30%, #C8E6C9 70%, #A5D6A7 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontFamily: "'Fredoka', 'Nunito', sans-serif",
      padding: "16px",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&display=swap');
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes bounceIn { 0% { transform: scale(0); opacity: 0; } 60% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        @keyframes shake { 0%,100% { transform: translateX(0); } 25% { transform: translateX(-8px); } 75% { transform: translateX(8px); } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>

      {/* Top Bar */}
      <div style={{
        width: "100%",
        maxWidth: "480px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "12px",
      }}>
        <button
          onClick={() => setGameState("menu")}
          style={{
            background: "rgba(255,255,255,0.8)",
            border: "none",
            borderRadius: "12px",
            padding: "8px 14px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#5D4E37",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ← {lang === "ZU" ? "Emuva" : lang === "AF" ? "Terug" : "Back"}
        </button>

        <ProgressBar current={round} total={totalRounds} />

        <div style={{
          background: "rgba(255,255,255,0.8)",
          borderRadius: "12px",
          padding: "8px 14px",
          fontSize: "14px",
          fontWeight: "700",
          color: "#F39C12",
        }}>
          {streak > 1 && "🔥"} {score}/{totalRounds}
        </div>
      </div>

      {/* Question */}
      <div style={{
        background: "rgba(255,255,255,0.9)",
        borderRadius: "20px",
        padding: "16px 24px",
        marginBottom: "16px",
        textAlign: "center",
        maxWidth: "480px",
        width: "100%",
        boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
      }}>
        <p style={{ fontSize: "20px", fontWeight: "700", color: "#5D4E37" }}>
          {lang === "ZU"
            ? `Zibale ${animalName}! Zingaki?`
            : lang === "AF"
            ? `Tel die ${animalName}! Hoeveel is daar?`
            : `Count the ${animalName}s! How many are there?`}
        </p>
      </div>

      {/* Animals Display */}
      <div style={{
        background: "rgba(255,255,255,0.7)",
        borderRadius: "24px",
        maxWidth: "480px",
        width: "100%",
        height: "420px",
        position: "relative",
        marginBottom: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        {/* Savanna Background Elements */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "60px", background: "linear-gradient(to top, rgba(139,195,74,0.2), transparent)", borderRadius: "0 0 24px 24px" }} />
        <div style={{ position: "absolute", top: "20px", right: "30px", fontSize: "32px", opacity: 0.2 }}>☀️</div>
        <div style={{ position: "absolute", top: "15px", left: "20px", fontSize: "18px", opacity: 0.15 }}>🌿</div>
        <div style={{ position: "absolute", bottom: "15px", right: "20px", fontSize: "18px", opacity: 0.15 }}>🌱</div>

        {currentAnimal && (
          <div style={{ position: "relative", width: `${Math.min(targetCount, 5) * 120}px`, height: `${Math.ceil(targetCount / 5) * 130}px` }}>
            {Array.from({ length: targetCount }, (_, i) => (
              <FloatingAnimal
                key={`${round}-${i}`}
                animal={currentAnimal}
                index={i}
                total={targetCount}
              />
            ))}
          </div>
        )}

        {gameState === "celebration" && <Celebration message={celebration} />}

        {isCorrect === false && (
          <div style={{
            position: "absolute",
            bottom: "16px",
            left: "16px",
            right: "16px",
            background: "rgba(231,76,60,0.9)",
            color: "white",
            borderRadius: "12px",
            padding: "12px",
            textAlign: "center",
            fontWeight: "600",
            fontSize: "15px",
            animation: "shake 0.5s ease",
          }}>
            {TRY_AGAIN[lang]}
          </div>
        )}
      </div>

      {/* Number Options */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "12px",
        justifyContent: "center",
        maxWidth: "480px",
      }}>
        {numberOptions.map((num) => (
          <NumberButton
            key={num}
            number={num}
            onClick={handleAnswer}
            disabled={gameState === "celebration"}
            isCorrect={selectedAnswer === num && isCorrect === true}
            isWrong={selectedAnswer === num && isCorrect === false}
            lang={lang}
          />
        ))}
      </div>

      {/* Level indicator */}
      <div style={{
        marginTop: "16px",
        fontSize: "12px",
        color: "#8B7355",
        fontWeight: "500",
      }}>
        {LEVELS[level].stars} {LEVELS[level].name} · {lang === "ZU" ? "Isigaba" : lang === "AF" ? "Vlak" : "Level"} · 🇿🇦 NovaLearning
      </div>
    </div>
  );
}
