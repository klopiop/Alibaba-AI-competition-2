"use client";

import { motion, useTime, useTransform, AnimatePresence } from "framer-motion";
import { useMemo, useState, useEffect, useCallback } from "react";

// ----------------------
// 数据定义
// ----------------------
const BAGUA = ["☰", "☱", "☲", "☳", "☴", "☵", "☶", "☷"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

// ----------------------
// 星座模板数据
// ----------------------
interface ConstellationTemplate {
  id: string;
  width: number;
  height: number;
  path: string;
  points: number[][];
}

const CONSTELLATION_TEMPLATES: ConstellationTemplate[] = [
  // 1. 北斗七星 (Big Dipper)
  {
    id: "big-dipper",
    width: 300, height: 200,
    path: "M40 40 L90 70 L140 100 L170 150 L220 160 L260 200 L300 190",
    points: [[40,40], [90,70], [140,100], [170,150], [220,160], [260,200], [300,190]],
  },
  // 2. 猎户座 (Orion)
  {
    id: "orion",
    width: 250, height: 350,
    path: "M50 50 L100 120 L200 110 M100 120 L80 200 L120 210 L160 200 M80 200 L50 300 M160 200 L220 280",
    points: [[50,50], [100,120], [200,110], [80,200], [120,210], [160,200], [50,300], [220,280]],
  },
  // 3. 仙后座 (Cassiopeia)
  {
    id: "cassiopeia",
    width: 200, height: 150,
    path: "M20 100 L60 40 L100 80 L140 40 L180 100",
    points: [[20,100], [60,40], [100,80], [140,40], [180,100]],
  },
  // 4. 天鹅座 (Cygnus)
  {
    id: "cygnus",
    width: 250, height: 250,
    path: "M125 20 L125 230 M20 100 L125 125 L230 100",
    points: [[125,20], [125,230], [20,100], [125,125], [230,100]],
  },
  // 5. 狮子座 (Leo)
  {
    id: "leo",
    width: 300, height: 200,
    path: "M250 150 L200 120 L100 130 L50 50 L100 20 L140 40",
    points: [[250,150], [200,120], [100,130], [50,50], [100,20], [140,40]],
  },
  // 6. 天蝎座 (Scorpius) - 巨大的 S 形
  {
    id: "scorpius",
    width: 200, height: 300,
    path: "M160 40 L140 70 L130 100 L120 150 L100 200 L60 240 L30 220 L50 190",
    points: [[160,40], [140,70], [130,100], [120,150], [100,200], [60,240], [30,220], [50,190]],
  },
  // 7. 双子座 (Gemini) - 两兄弟
  {
    id: "gemini",
    width: 180, height: 250,
    path: "M40 30 L45 120 L50 220 M120 40 L125 125 L130 210 M45 120 L125 125",
    points: [[40,30], [45,120], [50,220], [120,40], [125,125], [130,210]],
  },
  // 8. 金牛座 (Taurus) - V 形牛头
  {
    id: "taurus",
    width: 250, height: 200,
    path: "M20 20 L100 120 L230 30 M100 120 L120 180",
    points: [[20,20], [100,120], [230,30], [120,180]],
  },
  // 10. 处女座 (Virgo) - 复杂的 Y 形
  {
    id: "virgo",
    width: 300, height: 300,
    path: "M50 80 L120 120 L180 140 L250 200 M120 120 L100 180 L80 250 M120 120 L140 60",
    points: [[50,80], [120,120], [180,140], [250,200], [100,180], [80,250], [140,60]],
  },
  // 11. 射手座 (Sagittarius) - 茶壶形
  {
    id: "sagittarius",
    width: 250, height: 200,
    path: "M60 140 L120 140 L150 80 L90 80 L60 140 M120 140 L180 180 L150 80 M150 80 L180 30",
    points: [[60,140], [120,140], [150,80], [90,80], [180,180], [180,30]],
  },
  // 12. 摩羯座 (Capricornus) - 三角形风筝
  {
    id: "capricornus",
    width: 280, height: 200,
    path: "M40 40 L120 100 L240 80 L200 180 L120 100",
    points: [[40,40], [120,100], [240,80], [200,180]],
  },
  // 13. 天秤座 (Libra) - 矩形天平
  {
    id: "libra",
    width: 200, height: 150,
    path: "M50 120 L100 80 L150 120 L100 80 L100 30",
    points: [[50,120], [100,80], [150,120], [100,30]],
  },
  // 14. 水瓶座 (Aquarius) - 流水波纹
  {
    id: "aquarius",
    width: 220, height: 250,
    path: "M80 30 L100 60 L140 50 M100 60 L90 120 L130 150 L160 120 M130 150 L120 220",
    points: [[80,30], [100,60], [140,50], [90,120], [130,150], [160,120], [120,220]],
  },
  // 15. 双鱼座 (Pisces) - V形纽带
  {
    id: "pisces",
    width: 300, height: 250,
    path: "M50 80 L150 200 L250 100 M250 100 L280 120 M50 80 L30 100",
    points: [[50,80], [150,200], [250,100], [280,120], [30,100]],
  },
];

// ----------------------
// 组件：单个星座 (Constellation Item)
// ----------------------
function ConstellationItem({ 
  template, 
  x, 
  y, 
  scale, 
  onComplete 
}: { 
  template: ConstellationTemplate; 
  x: number; 
  y: number; 
  scale: number;
  onComplete: () => void;
}) {
  const [stage, setStage] = useState<"drawing" | "staying" | "fading">("drawing");

  // 动画时长
  const drawDuration = 3;
  const stayDuration = 4;
  const fadeDuration = 2;

  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;

    // 绘制完成后进入停留阶段
    timer1 = setTimeout(() => {
      setStage("staying");
      
      // 停留完成后进入消失阶段
      timer2 = setTimeout(() => {
        setStage("fading");
      }, stayDuration * 1000);

    }, drawDuration * 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <motion.div
      className="absolute opacity-60 pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: template.width * scale,
        height: template.height * scale,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: stage === "fading" ? 0 : 0.6 }}
      transition={{ duration: stage === "fading" ? fadeDuration : 1 }}
      onAnimationComplete={(definition) => {
        if (stage === "fading" && (definition as any).opacity === 0) {
          onComplete();
        }
      }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${template.width} ${template.height}`} 
        className="drop-shadow-[0_0_2px_rgba(246,211,139,0.3)]"
        style={{ overflow: "visible" }}
      >
        {/* 连线 - 动态绘制 */}
        <motion.path
          d={template.path}
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: 1, 
            opacity: 1 
          }}
          transition={{ 
            duration: drawDuration, 
            ease: "easeInOut",
          }}
        />
        
        {/* 星点 - 顺次点亮 */}
        {template.points.map((p, i) => (
           <motion.circle
              key={i}
              cx={p[0]} cy={p[1]} r={Math.random() * 2 + 1.5}
              fill="#F6D38B"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ 
                scale: stage === "fading" ? 0 : [0, 1.2, 1], 
                opacity: stage === "fading" ? 0 : [0, 1, 0.8] 
              }}
              transition={{ 
                duration: 1, 
                delay: i * (drawDuration / template.points.length) * 0.8, // 随线条进度出现
                opacity: { duration: stage === "fading" ? fadeDuration : 1 }
              }}
           />
        ))}
      </svg>
    </motion.div>
  );
}

// ----------------------
// 辅助组件：金丝星空 (背景装饰)
// ----------------------
function ConstellationBackground() {
  const [activeConstellations, setActiveConstellations] = useState<{
    instanceId: number;
    template: ConstellationTemplate;
    x: number;
    y: number;
    scale: number;
  }[]>([]);

  // 静态背景星尘 (保持不变)
  const stars = useMemo(() => {
    return Array.from({ length: 300 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      duration: Math.random() * 3 + 2,
    }));
  }, []);

  // 定时生成新星座
  useEffect(() => {
    let idCounter = 0;
    const interval = setInterval(() => {
      // 限制同时存在的最大数量，避免性能问题
      setActiveConstellations(prev => {
        if (prev.length > 4) return prev; 

        const template = CONSTELLATION_TEMPLATES[Math.floor(Math.random() * CONSTELLATION_TEMPLATES.length)];
        idCounter++;
        
        return [...prev, {
          instanceId: Date.now() + idCounter,
          template,
          x: Math.random() * 80 + 5, // 5% - 85%
          y: Math.random() * 60 + 5, // 5% - 65% (尽量靠上一点，不要太低被遮挡)
          scale: Math.random() * 0.5 + 0.5, // 0.5 - 1.0
        }];
      });
    }, 2500); // 每 2.5 秒尝试生成一个

    return () => clearInterval(interval);
  }, []);

  const handleComplete = useCallback((instanceId: number) => {
    setActiveConstellations(prev => prev.filter(c => c.instanceId !== instanceId));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {/* 1. 静态背景星尘 */}
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-gold-muted"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
          }}
          animate={{ opacity: [star.opacity, star.opacity * 2, star.opacity] }}
          transition={{ duration: star.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* 2. 动态随机星座 */}
      <AnimatePresence>
        {activeConstellations.map((c) => (
          <ConstellationItem
            key={c.instanceId}
            template={c.template}
            x={c.x}
            y={c.y}
            scale={c.scale}
            onComplete={() => handleComplete(c.instanceId)}
          />
        ))}
      </AnimatePresence>

      <svg width="0" height="0">
        <defs>
             <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
               <stop offset="0%" stopColor="rgba(246,211,139,0.1)" />
               <stop offset="50%" stopColor="rgba(246,211,139,0.6)" />
               <stop offset="100%" stopColor="rgba(246,211,139,0.1)" />
             </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ----------------------
// 辅助组件：虚无飘渺的粒子 (Ethereal Particles)
// ----------------------
function EtherealParticles() {
  const particles = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50, // 相对中心偏移 %
      y: Math.random() * 100 - 50,
      z: Math.random() * 400 - 200, // 3D 深度分布
      size: Math.random() * 4 + 1,
      duration: Math.random() * 5 + 3,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none transform-style-3d">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold-strong blur-[1px]"
          style={{
            left: "50%",
            top: "50%",
            width: p.size,
            height: p.size,
            x: `${p.x}%`,
            y: `${p.y}%`,
            z: p.z,
          }}
          animate={{
            y: [`${p.y}%`, `${p.y - 20}%`], // 向上飘浮
            opacity: [0, 0.6, 0], // 淡入淡出
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

// ----------------------
// 核心组件：精致的环 (Ring)
// ----------------------
interface RingProps {
  size: number;
  rotateDuration?: number; // 旋转一周的秒数，负数逆时针
  rotateOffset?: number; // 初始角度
  zIndex: number; // 3D z-index (translateZ)
  opacity?: number;
  glow?: boolean; // 是否开启神秘辉光
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function Ring({ size, rotateDuration = 0, rotateOffset = 0, zIndex, opacity = 1, glow = false, children, className, style }: RingProps) {
  const time = useTime();
  
  // 确保 Hook 无条件执行
  // 处理 rotateDuration 为 0 的情况，防止除以 0 或逻辑错误，但主要为了保持 Hook 调用顺序
  const safeDuration = rotateDuration === 0 ? 100000 : rotateDuration; 
  
  const rotate = useTransform(
    time, 
    [0, Math.abs(safeDuration) * 1000], 
    [0, safeDuration > 0 ? 360 : -360], 
    { clamp: false }
  );
  
  // 始终调用 useTransform 来计算带 offset 的旋转值
  const rotateWithOffset = useTransform(rotate, r => r + rotateOffset);
  
  // 根据 props 决定使用动态值还是静态值
  const rotationStyle = rotateDuration !== 0 
    ? { rotate: rotateWithOffset }
    : { rotate: rotateOffset };

  return (
    <motion.div
      className={`absolute flex items-center justify-center rounded-full transform-style-3d ${className}`}
      style={{
        width: size,
        height: size,
        transform: `translateZ(${zIndex}px)`, 
        opacity,
        boxShadow: glow ? "0 0 40px rgba(246, 211, 139, 0.3), inset 0 0 20px rgba(246, 211, 139, 0.1)" : undefined, // 增加辉光
        ...rotationStyle,
        ...style
      }}
    >
      {/* 辉光增强层 - 仅当 glow 开启时显示 */}
      {glow && (
        <div className="absolute inset-[-10px] rounded-full bg-gold-strong/10 blur-[20px] animate-pulse-slow pointer-events-none" />
      )}
      {children}
    </motion.div>
  );
}

// ----------------------
// 组件：文字内容
// ----------------------
function RingText({ items, radius, fontSize = "14px", color = "rgba(246,211,139,0.8)", active = false }: { items: string[], radius: number, fontSize?: string, color?: string, active?: boolean }) {
  const angleStep = 360 / items.length;
  
  return (
    <div className="absolute inset-0">
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 flex items-center justify-center font-serif"
          style={{
            transform: `translate(-50%, -50%) rotate(${i * angleStep}deg) translateY(-${radius}px)`,
            color: color,
            fontSize: fontSize,
            textShadow: active ? "0 0 10px rgba(246,211,139,0.6)" : "none",
            opacity: active ? 1 : 0.7,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
}

export default function LuopanBackground() {
  const MOUNTAIN_FULL = useMemo(() => {
     return [...BAGUA, ...BRANCHES, ...STEMS, ...BAGUA, ...BRANCHES].slice(0, 64); // 64卦更多密密麻麻的感觉
  }, []);

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none perspective-[1200px]" // 透视感适中
      style={{ perspectiveOrigin: "50% 50%" }}
    >
      <ConstellationBackground />
      
      {/* 
        3D 容器 - 调整位置到右侧
      */}
      <div
        className="relative flex items-center justify-center transform-style-3d"
        style={{
          // scale(1.0 -> 1.3): 整体放大，增加压迫感和细节展示
          transform: "translateX(35vw) translateY(10vh) rotateX(60deg) rotateY(-32deg) rotateZ(10deg) scale(1.3)", 
        }}
      >
        
        {/* === Ethereal Particles: 穿插在罗盘中的粒子 === */}
        <EtherealParticles />
        
        {/* === Layer -1: 底部光晕 (氛围) === */}
        <Ring size={1000} zIndex={-100} className="bg-gold-strong/5 blur-[100px]" />
        
        {/* === Layer 0: 最外层光环 (能量边界) === */}
        <Ring size={900} zIndex={0} rotateDuration={200} glow={true} className="border border-gold-muted/10">
           <div className="absolute inset-0 rounded-full border border-gold-muted/20 opacity-30" />
           <div className="absolute inset-0 rounded-full border-[2px] border-t-gold-strong/30 border-r-transparent border-b-gold-strong/30 border-l-transparent animate-spin-slow" />
        </Ring>

        {/* === Layer 1: 密文圈 (背景纹理) === */}
        <Ring size={850} zIndex={20} rotateDuration={-240} className="border border-gold-muted/5 bg-black/40 backdrop-blur-[2px]">
           {/* 极细同心圆装饰 */}
           <div className="absolute inset-[10px] rounded-full border border-gold-muted/10" />
           <div className="absolute inset-[20px] rounded-full border border-gold-muted/10" />
           <RingText items={MOUNTAIN_FULL} radius={410} fontSize="10px" color="rgba(246,211,139,0.3)" />
        </Ring>

        {/* === Layer 2: 刻度圈 (精密感) === */}
        <Ring size={700} zIndex={40} rotateDuration={180} glow={true} className="shadow-[inset_0_0_30px_rgba(0,0,0,0.8)]">
          {/* SVG 刻度线 */}
          <svg className="absolute inset-0 w-full h-full opacity-40">
            <circle cx="50%" cy="50%" r="49%" fill="none" stroke="rgba(246,211,139,0.2)" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(246,211,139,0.1)" strokeWidth="10" />
          </svg>
          <div className="absolute inset-0 rounded-full border border-gold-muted/20" />
        </Ring>

        {/* === Layer 3: 二十八星宿/六十四卦 (主要文字层) === */}
        <Ring size={600} zIndex={60} rotateDuration={-120} className="bg-gradient-to-br from-black/80 via-black/40 to-black/80 backdrop-blur-sm border border-gold-muted/20">
           <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(246,211,139,0.1)]" />
           <RingText items={MOUNTAIN_FULL.slice(0, 32)} radius={285} fontSize="14px" color="rgba(246,211,139,0.6)" />
        </Ring>

        {/* === Layer 4: 地支圈 (实心质感层) === */}
        <Ring size={450} zIndex={90} rotateDuration={90} glow={true} className="bg-[#0a0a0a] border border-gold-strong/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
           {/* 质感光泽 */}
           <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,rgba(212,175,55,0.1)_180deg,transparent_360deg)] opacity-50" />
           <div className="absolute inset-[4px] rounded-full border border-gold-muted/20" />
           <RingText items={BRANCHES} radius={200} fontSize="20px" color="#F6D38B" active={true} />
        </Ring>

        {/* === Layer 5: 八卦核心 (高亮层) === */}
        <Ring size={300} zIndex={120} rotateDuration={-60} glow={true} className="bg-black/90 border-[2px] border-gold-strong/50 shadow-[0_0_40px_rgba(246,211,139,0.3)]">
           <RingText items={BAGUA} radius={120} fontSize="32px" color="#FFD700" active={true} />
           {/* 内部装饰线 */}
           <div className="absolute inset-[15%] rounded-full border border-gold-strong/20" />
           <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gold-strong/20" />
           <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gold-strong/20" />
        </Ring>

        {/* === Layer 6: 天池 (能量中心) === */}
        <Ring size={100} zIndex={160} rotateDuration={30} glow={true} className="bg-black border-[4px] border-gold-strong shadow-[0_0_50px_rgba(255,215,0,0.6)]">
           <div className="absolute inset-0 rounded-full bg-gradient-to-t from-gold-strong/50 to-transparent" />
           
           {/* 指针: 悬浮的磁针 */}
           <div className="absolute top-1/2 left-1/2 w-[60%] h-[6px] -translate-x-1/2 -translate-y-1/2">
             <div className="w-full h-full bg-gradient-to-r from-red-600 via-gold-strong to-red-600 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.8)]" />
             <div className="absolute left-1/2 top-1/2 w-[12px] h-[12px] -translate-x-1/2 -translate-y-1/2 bg-gold-strong rounded-full shadow-[0_0_5px_#fff]" />
           </div>
        </Ring>

        {/* === 纵深光柱 (The Pillar) === */}
        <motion.div
           className="absolute z-[-1] bottom-0 h-[1000px] w-[2px] bg-gradient-to-t from-gold-strong via-gold-strong/30 to-transparent blur-[4px]"
           style={{ transform: "rotateX(-90deg) translateZ(0px) translateY(-500px)" }} // 从中心射出
        />

      </div>
    </div>
  );
}