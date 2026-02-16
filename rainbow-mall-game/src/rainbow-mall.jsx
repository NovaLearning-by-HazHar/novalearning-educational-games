import { useState, useEffect } from "react";
import { Canvas } from '@react-three/fiber';
import { Sprite } from '@react-three/fiber';
import { OrbitControls, Box, Cylinder, Sphere, useTexture } from '@react-three/drei';

const CDN = "https://res.cloudinary.com/dbizoensp/image/upload";
const BUDDIES = {
  elethu: `${CDN}/w_120,h_120,c_fill,f_auto,q_auto/novalearning/characters/elethu-elephant`,
  dumisani: `${CDN}/w_120,h_120,c_fill,f_auto,q_auto/novalearning/characters/dumisani-beetle`,
  buhle: `${CDN}/w_120,h_120,c_fill,f_auto,q_auto/novalearning/characters/buhle-baboon`,
  fezile: `${CDN}/w_120,h_120,c_fill,f_auto,q_auto/novalearning/characters/fezile-flamingo`,
};

const STALLS = [
  { id: 0, name: "Zulu Beadwork", color: "#D4A543", buddy: "elethu", pos: [4, 0, 0] },
  { id: 1, name: "Xhosa Crafts", color: "#8B7EC8", buddy: "dumisani", pos: [2, 0, 3.5] },
  { id: 2, name: "Afrikaner Bakery", color: "#E91E8C", buddy: "buhle", pos: [-2, 0, 3.5] },
  { id: 3, name: "Cape Malay Spices", color: "#4CAF50", buddy: "fezile", pos: [-4, 0, 0] },
  { id: 4, name: "Indian Sweets", color: "#FF6B35", buddy: "elethu", pos: [-2, 0, -3.5] },
  { id: 5, name: "Venda Art", color: "#4CC9F0", buddy: "buhle", pos: [2, 0, -3.5] },
];

const ITEMS = {
  0: [{ name: "Balloons", emoji: "🎈", price: 100 }, { name: "Party Hats", emoji: "🎩", price: 50 }],
  1: [{ name: "Streamers", emoji: "🎀", price: 100 }, { name: "Candles", emoji: "🕯️", price: 50 }],
  2: [{ name: "Cake", emoji: "🎂", price: 500 }, { name: "Cupcakes", emoji: "🧁", price: 200 }],
  3: [{ name: "Plates", emoji: "🍽️", price: 100 }, { name: "Napkins", emoji: "🧻", price: 50 }],
  4: [{ name: "Juice", emoji: "🧃", price: 200 }, { name: "Sweets", emoji: "🍬", price: 100 }],
  5: [{ name: "Cups", emoji: "🥤", price: 200 }, { name: "Tablecloth", emoji: "🧺", price: 100 }],
};

const QUEST = {
  title: "Ubuntu Birthday Party! 🎉",
  budget: 1000,
  list: ["Balloons", "Cake", "Juice", "Plates", "Candles"],
  message: "Help prepare a surprise party for Gogo! Visit the stalls to buy party supplies!",
};

const fmtVal = v => v >= 100 ? `R${(v/100).toFixed(v%100?2:0)}` : `${v}c`;

function MarketStall({ position, color, onClick, selected }) {
  return (
    <group position={position} onClick={onClick}>
      <Box args={[3, 0.2, 2]} position={[0, 1, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      {[[-1.4, -0.9], [1.4, -0.9], [-1.4, 0.9], [1.4, 0.9]].map((p, i) => (
        <Cylinder key={i} args={[0.05, 0.05, 2]} position={[p[0], 2, p[1]]}>
          <meshStandardMaterial color="#5D4037" />
        </Cylinder>
      ))}
      <Box args={[3.2, 0.1, 2.2]} position={[0, 3, 0]}>
        <meshStandardMaterial color={color} opacity={0.8} transparent />
      </Box>
      {selected && (
        <Cylinder args={[1.8, 1.8, 0.05]} position={[0, 0.05, 0]} rotation={[Math.PI/2, 0, 0]}>
          <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={0.5} />
        </Cylinder>
      )}
    </group>
  );
}

function CharacterSprite({ buddy, position }) {
  const texture = useTexture(BUDDIES[buddy]);
  return (
    <Sprite position={position} scale={[1.2, 1.2, 1]}>
      <spriteMaterial map={texture} transparent />
    </Sprite>
  );
}

function MallScene({ onStallClick, selectedStall }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <Box args={[15, 0.1, 15]} position={[0, -0.05, 0]}>
        <meshStandardMaterial color="#E0E0E0" />
      </Box>
      {STALLS.map(stall => (
        <group key={stall.id}>
          <MarketStall
            position={stall.pos}
            color={stall.color}
            onClick={() => onStallClick(stall.id)}
            selected={selectedStall === stall.id}
          />
          <CharacterSprite buddy={stall.buddy} position={[stall.pos[0], 1.5, stall.pos[2]]} />
        </group>
      ))}
      <Cylinder args={[0.8, 0.8, 0.1]} position={[0, 0.05, 0]} rotation={[Math.PI/2, 0, 0]}>
        <meshStandardMaterial color="#FF6B35" />
      </Cylinder>
    </>
  );
}

function StallUI({ stall, items, onBuy, budget, basket }) {
  if (!stall) return null;

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0,
      background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.9))',
      padding: '20px', color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <img src={BUDDIES[stall.buddy]} alt="" style={{ width: 60, height: 60, borderRadius: '50%' }} />
        <div>
          <h3 style={{ margin: 0, fontSize: 18 }}>{stall.name}</h3>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }}>Budget: {fmtVal(budget)}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map((item, i) => {
          const owned = basket.find(b => b.name === item.name);
          return (
            <button
              key={i}
              onClick={() => onBuy(item)}
              disabled={owned || budget < item.price}
              style={{
                background: owned ? '#4CAF50' : 'white',
                color: owned ? 'white' : '#333',
                border: 'none', borderRadius: 12, padding: '12px',
                opacity: owned || budget < item.price ? 0.5 : 1,
                cursor: owned || budget < item.price ? 'not-allowed' : 'pointer'
              }}
            >
              <div style={{ fontSize: 24 }}>{item.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{item.name}</div>
              <div style={{ fontSize: 11 }}>{fmtVal(item.price)}</div>
              {owned && <div style={{ fontSize: 10 }}>✓ In basket</div>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function RainbowMall() {
  const [screen, setScreen] = useState('splash');
  const [selectedStall, setSelectedStall] = useState(null);
  const [basket, setBasket] = useState([]);
  const [budget, setBudget] = useState(QUEST.budget);

  const handleBuy = (item) => {
    if (budget >= item.price && !basket.find(b => b.name === item.name)) {
      setBasket([...basket, item]);
      setBudget(budget - item.price);
    }
  };

  const checkComplete = () => {
    return QUEST.list.every(need => basket.find(b => b.name === need));
  };

  useEffect(() => {
    if (checkComplete() && basket.length > 0) {
      setTimeout(() => setScreen('celebrate'), 1000);
    }
  }, [basket]);

  if (screen === 'splash') {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFE0B2, #FF8A65)'
      }}>
        <h1 style={{ fontSize: 32, color: '#2D1B69', margin: '20px 0' }}>
          🏪 Rainbow Nation Mall
        </h1>
        <p style={{ fontSize: 16, maxWidth: 300, textAlign: 'center', color: '#5D4037' }}>
          {QUEST.message}
        </p>
        <button
          onClick={() => setScreen('game')}
          style={{
            background: '#FF6B35', color: 'white', border: 'none',
            borderRadius: 50, padding: '16px 40px', fontSize: 18,
            cursor: 'pointer', marginTop: 20
          }}
        >
          Start Shopping! 🛒
        </button>
      </div>
    );
  }

  if (screen === 'celebrate') {
    return (
      <div style={{
        position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #FFF9C4, #FFCC02)'
      }}>
        <h1 style={{ fontSize: 36, color: '#2D1B69' }}>Ubuntu! 🎉</h1>
        <p style={{ fontSize: 18, maxWidth: 400, textAlign: 'center' }}>
          We prepared the party TOGETHER! That's Ubuntu — I am because we are!
        </p>
        <div style={{ display: 'flex', gap: 8, margin: '20px 0' }}>
          {Object.values(BUDDIES).map((src, i) => (
            <img key={i} src={src} alt="" style={{ width: 60, height: 60, borderRadius: '50%' }} />
          ))}
        </div>
        <p style={{ fontSize: 14, color: '#666' }}>Change left: {fmtVal(budget)}</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#87CEEB' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
        background: 'rgba(0,0,0,0.7)', color: 'white', padding: 12
      }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>{QUEST.title}</div>
        <div style={{ fontSize: 11 }}>
          Need: {QUEST.list.map(item => {
            const has = basket.find(b => b.name === item);
            return <span key={item} style={{ opacity: has ? 0.5 : 1 }}>
              {has ? '✓' : '○'} {item}{' '}
            </span>;
          })}
        </div>
      </div>

      <Canvas
        camera={{ position: [0, 12, 12], fov: 50 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <MallScene onStallClick={setSelectedStall} selectedStall={selectedStall} />
        <OrbitControls
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 3}
        />
      </Canvas>

      {selectedStall !== null && (
        <>
          <StallUI
            stall={STALLS[selectedStall]}
            items={ITEMS[selectedStall]}
            onBuy={handleBuy}
            budget={budget}
            basket={basket}
          />
          <button
            onClick={() => setSelectedStall(null)}
            style={{
              position: 'absolute', bottom: 20, right: 20, zIndex: 20,
              background: '#FF6B35', color: 'white', border: 'none',
              borderRadius: '50%', width: 50, height: 50, fontSize: 24,
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </>
      )}
    </div>
  );
}
