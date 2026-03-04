import React, { useEffect, useRef, useState } from "react";

// --- 全局设计规范 (Figma Config) ---
const THEME = {
  primary: "#DA205A",
  bg: "#050505",
  glass: "rgba(255, 255, 255, 0.03)",
  border: "rgba(255, 255, 255, 0.12)",
  fontTitle: "'Inter', sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};

export default function App() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 1. 物理粒子背景 (带有鼠标避让效果)
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    let pts = [];
    let mouse = { x: -1000, y: -1000 };

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      pts = Array.from({ length: 1800 }, () => ({
        u: Math.random() * Math.PI * 2,
        v: Math.random() * Math.PI * 2,
        r1: 180,
        r2: 80,
        ox: 0,
        oy: 0,
      }));
    };

    const draw = (time) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = time * 0.0004;
      pts.forEach((p) => {
        let x3d = (p.r1 + p.r2 * Math.cos(p.u)) * Math.cos(p.v + t);
        let y3d = (p.r1 + p.r2 * Math.cos(p.u)) * Math.sin(p.v + t);
        let z3d = p.r2 * Math.sin(p.u);
        const s = 600 / (600 + z3d);
        const px =
          (y3d * Math.cos(0.5) - z3d * Math.sin(0.5)) * s + canvas.width / 2;
        const py = x3d * s + canvas.height / 2;

        // 交互逻辑
        const dx = mouse.x - px;
        const dy = mouse.y - py;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let tx = px,
          ty = py;
        if (dist < 100) {
          tx -= dx * (100 - dist) * 0.02;
          ty -= dy * (100 - dist) * 0.02;
        }

        ctx.globalAlpha = Math.max(0.1, (z3d + 80) / 200);
        ctx.fillStyle = THEME.primary;
        ctx.beginPath();
        ctx.arc(tx, ty, s * 1.2, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(draw);
    };

    const handleMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (cursorRef.current)
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("resize", init);
    init();
    draw(0);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", init);
    };
  }, []);

  return (
    <div
      style={{
        backgroundColor: THEME.bg,
        color: "#fff",
        minHeight: "100vh",
        fontFamily: THEME.fontTitle,
        cursor: "none",
      }}
    >
      {/* 霓虹交互光标 */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "30px",
          height: "30px",
          border: `1px solid ${THEME.primary}`,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "transform 0.06s ease-out",
          boxShadow: `0 0 20px ${THEME.primary}`,
          mixBlendMode: "screen",
        }}
      />

      {/* Hero 区域 */}
      <section
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        />
        <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
          <h1
            style={{
              fontSize: "min(14vw, 150px)",
              fontWeight: 900,
              fontStyle: "italic",
              letterSpacing: "-6px",
              margin: 0,
            }}
          >
            岳 靓
          </h1>
          <p
            style={{
              fontFamily: THEME.fontMono,
              color: THEME.primary,
              letterSpacing: "8px",
              opacity: 0.8,
            }}
          >
            DRUM INSTRUCTOR / ARTIST
          </p>
          <button
            className="hover-btn"
            style={{
              marginTop: "40px",
              padding: "15px 40px",
              borderRadius: "50px",
              background: "white",
              color: "black",
              border: "none",
              fontWeight: "bold",
              cursor: "none",
              transition: "0.3s",
            }}
          >
            EXPLORE WORK →
          </button>
        </div>
      </section>

      {/* 核心排版：左侧固定，右侧滚动 */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "100px 40px",
          display: "grid",
          gridTemplateColumns: "1fr 1.8fr",
          gap: "80px",
        }}
      >
        {/* 左侧：简历简介 (含技能标签) */}
        <div style={{ position: "sticky", top: "80px", height: "fit-content" }}>
          <div
            className="avatar-box"
            style={{
              width: "100%",
              aspectRatio: "1/1",
              borderRadius: "24px",
              overflow: "hidden",
              border: `1px solid ${THEME.border}`,
              background: "#111",
              transition: "0.5s",
            }}
          >
            <img
              src="/人物照.jpg"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              alt="岳靓"
            />
          </div>

          <h2
            style={{
              fontSize: "48px",
              fontWeight: 900,
              marginTop: "30px",
              marginBottom: "5px",
              color: "white",
            }}
          >
            岳 靓
          </h2>
          <div
            style={{
              color: THEME.primary,
              fontWeight: "bold",
              fontFamily: THEME.fontMono,
              marginBottom: "20px",
            }}
          >
            Drum Instructor
          </div>

          <div
            style={{
              color: "#ccc",
              lineHeight: 1.8,
              fontSize: "15px",
              spaceY: "10px",
            }}
          >
            <p style={{ margin: "5px 0" }}>毕业于 广西师范大学 音乐教育专业</p>
            <p style={{ margin: "5px 0" }}>
              进修于 北京凤凰现代艺术教育中心（职业鼓手方向）
            </p>
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "8px",
              marginTop: "30px",
            }}
          >
            {[
              "教师资格认证",
              "9年教学经验",
              "交响乐团打击乐经历",
              "中国好鼓手认证评委",
            ].map((tag) => (
              <span
                key={tag}
                className="tag"
                style={{
                  padding: "6px 12px",
                  border: `1px solid ${THEME.border}`,
                  borderRadius: "4px",
                  fontSize: "11px",
                  color: "#888",
                  background: "rgba(255,255,255,0.03)",
                  transition: "0.3s",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 右侧：垂直时间轴 */}
        <div
          style={{
            borderLeft: `1px solid ${THEME.border}`,
            paddingLeft: "50px",
            position: "relative",
          }}
        >
          {[
            {
              year: "2025 - Present",
              title: "中国好鼓手认证评委",
              desc: "参与赛事评审与教学标准执行工作。",
            },
            {
              year: "2022",
              title: "优秀教师称号",
              desc: "指导学生参加中国好鼓手赛事，获得区域四强、八强及多项等级奖项。",
            },
            {
              year: "2020",
              title: "苏州保利大剧院 交响音乐会",
              desc: "担任打击乐演奏工作，完成剧院级音乐会现场演出。",
            },
            {
              year: "2016",
              title: "桂林市交响乐团 打击乐手",
              desc: "参与巡演项目及交响作品演出，积累乐团协作与大型舞台实践经验。",
            },
            {
              year: "2014 - 2017",
              title: "WHY乐队 鼓手",
              desc: "参与乐队创作与专场演出策划，完成专场演出执行与现场演奏工作。",
            },
          ].map((item, i) => (
            <div
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{
                marginBottom: "40px",
                padding: "40px",
                borderRadius: "20px",
                background:
                  hoveredIndex === i
                    ? "rgba(218,32,90,0.08)"
                    : "rgba(255,255,255,0.02)",
                border: `1px solid ${
                  hoveredIndex === i ? THEME.primary : THEME.border
                }`,
                transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                position: "relative",
                transform: hoveredIndex === i ? "translateX(15px)" : "none",
              }}
            >
              {/* 时间轴圆点 */}
              <div
                style={{
                  position: "absolute",
                  left: "-61px",
                  top: "45px",
                  width: "20px",
                  height: "20px",
                  backgroundColor:
                    hoveredIndex === i ? THEME.primary : "#1a1a1a",
                  borderRadius: "50%",
                  border: "4px solid #050505",
                  boxShadow:
                    hoveredIndex === i ? `0 0 25px ${THEME.primary}` : "none",
                  transition: "0.3s",
                }}
              />

              <div
                style={{
                  fontFamily: THEME.fontMono,
                  color: THEME.primary,
                  fontSize: "13px",
                  marginBottom: "10px",
                  opacity: 0.8,
                }}
              >
                {item.year}
              </div>
              <h3
                style={{
                  fontSize: "24px",
                  fontWeight: 800,
                  margin: 0,
                  color: "white",
                }}
              >
                {item.title}
              </h3>
              <p
                style={{
                  color: "#888",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  marginTop: "15px",
                }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 教学方式区域 --- */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "120px auto",
          padding: "0 40px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div style={{ marginBottom: "60px" }}>
          <h2
            style={{
              fontSize: "clamp(40px, 5vw, 70px)",
              fontWeight: 900,
              fontStyle: "italic",
              margin: 0,
              letterSpacing: "-2px",
            }}
          >
            教学方式
          </h2>
          <p
            style={{
              color: THEME.primary,
              fontFamily: THEME.fontMono,
              marginTop: "10px",
              letterSpacing: "3px",
            }}
          >
            ABILITIES STRUCTURE BUILDING
          </p>
        </div>

        {/* 响应式网格布局 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "30px",
          }}
        >
          {[
            {
              phase: "PHASE 01",
              title: "基础阶段",
              desc: "建立正确持棒方式与节奏感知能力，避免错误习惯定型。",
              color: "#DA205A",
            },
            {
              phase: "PHASE 02",
              title: "技术阶段",
              desc: "系统训练单双击、滚奏、三连音、Funk节奏、律动控制等核心技巧。",
              color: "#00F2FF",
            },
            {
              phase: "PHASE 03",
              title: "应用阶段",
              desc: "通过曲目实战提升对音乐结构的理解与动态控制能力。",
              color: "#7000FF",
            },
            {
              phase: "PHASE 04",
              title: "提升阶段",
              desc: "针对考级、比赛或舞台演出进行专项强化。",
              color: "#FFCF00",
            },
          ].map((item, i) => (
            <TeachingCard key={i} item={item} />
          ))}
        </div>

        {/* 核心理念陈述 */}
        <div
          style={{
            marginTop: "80px",
            padding: "60px 40px",
            borderRadius: "30px",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
            border: `1px solid ${THEME.border}`,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "20px",
              color: "#ccc",
              lineHeight: 1.8,
              maxWidth: "900px",
              margin: "0 auto",
            }}
          >
            “ 强调
            <span style={{ color: THEME.primary, fontWeight: "bold" }}>
              理解与感受
            </span>
            ，而非机械模仿。所有课程采用自编教材，根据年龄与能力分层设计。 ”
          </p>
        </div>
      </section>

      {/* --- 教学理念模块 (禅意沉淀) --- */}
      <section
        style={{
          height: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          borderTop: `1px solid ${THEME.border}`,
        }}
      >
        {/* 背景装饰：巨大的半透明文字 */}
        <div
          style={{
            position: "absolute",
            fontSize: "25vw",
            fontWeight: 900,
            color: "rgba(255,255,255,0.02)",
            whiteSpace: "nowrap",
            zIndex: 0,
            fontStyle: "italic",
            userSelect: "none",
          }}
        >
          STABILITY
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            padding: "0 20px",
          }}
        >
          {/* 四字箴言 */}
          <h2
            style={{
              fontSize: "clamp(60px, 8vw, 120px)",
              fontWeight: 900,
              letterSpacing: "20px",
              margin: "0 0 40px 0",
              background: "linear-gradient(180deg, #fff 0%, #666 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.5))",
            }}
          >
            行稳致远
          </h2>

          {/* 理念描述 */}
          <div
            style={{
              maxWidth: "600px",
              margin: "0 auto",
              fontFamily: THEME.fontMono,
              lineHeight: "2.5",
              color: "#888",
              fontSize: "16px",
              letterSpacing: "2px",
            }}
          >
            <p style={{ margin: 0 }}>音乐的学习不在于一时的速度，</p>
            <p style={{ margin: 0 }}>
              而在于<span style={{ color: THEME.primary }}>稳定与理解</span>。
            </p>
            <p style={{ margin: 0 }}>尊重兴趣，也守住标准。</p>
            <p
              style={{
                margin: "20px 0 0 0",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
              }}
            >
              让能力在时间里慢慢沉淀。
            </p>
          </div>

          {/* 装饰性呼吸线条 */}
          <div
            style={{
              width: "1px",
              height: "100px",
              background: `linear-gradient(to bottom, ${THEME.primary}, transparent)`,
              margin: "60px auto 0",
              opacity: 0.5,
            }}
          />
        </div>
      </section>

      {/* 底部 */}
      <footer
        style={{
          padding: "100px",
          textAlign: "center",
          borderTop: `1px solid ${THEME.border}`,
          opacity: 0.5,
          fontSize: "12px",
        }}
      >
        © 2026 YUE LIANG STUDIO · INTERACTIVE PORTFOLIO
      </footer>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&family=JetBrains+Mono:wght@400;700&display=swap');
        body { margin: 0; background: #050505; }
        .hover-btn:hover { background: ${THEME.primary} !important; color: white !important; transform: scale(1.05); }
        .avatar-box:hover { border-color: ${THEME.primary}; transform: rotate(-2deg) scale(1.02); }
        .tag:hover { background: ${THEME.primary}; color: white !important; border-color: white; }
      `,
        }}
      />
    </div>
  );
} // 这个组件独立于 App 之外，负责处理每张卡片的 3D 旋转和聚光灯效果
function TeachingCard({ item }) {
  const cardRef = useRef(null);
  const [coords, setCoords] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // 计算 3D 旋转：鼠标偏离中心越远，旋转角度越大
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    setCoords({ x, y, rotateX, rotateY });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCoords({ x: 0, y: 0, rotateX: 0, rotateY: 0 });
      }}
      style={{
        position: "relative",
        height: "320px",
        background: isHovered ? "transparent" : "#0a0a0a",
        borderRadius: "24px",
        padding: "1px", // 边框厚度
        overflow: "hidden",
        transition: "transform 0.1s ease-out",
        transform: `perspective(1000px) rotateX(${coords.rotateX}deg) rotateY(${
          coords.rotateY
        }deg) scale(${isHovered ? 1.02 : 1})`,
      }}
    >
      {/* 聚光灯边框：通过 Radial Gradient 实现跟随鼠标的光晕 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at ${coords.x}px ${coords.y}px, ${item.color} 0%, transparent 40%)`,
          opacity: isHovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      />

      {/* 卡片内部容器 */}
      <div
        style={{
          position: "relative",
          height: "100%",
          background: "#0f0f0f",
          borderRadius: "23px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          zIndex: 1,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono'",
              color: item.color,
              fontSize: "12px",
              fontWeight: "bold",
              letterSpacing: "2px",
            }}
          >
            {item.phase}
          </div>
          <h3
            style={{
              fontSize: "28px",
              margin: "15px 0",
              color: "#fff",
              fontWeight: 900,
            }}
          >
            {item.title}
          </h3>
          <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.6 }}>
            {item.desc}
          </p>
        </div>
        <div
          style={{
            color: item.color,
            fontSize: "24px",
            alignSelf: "flex-end",
            opacity: isHovered ? 1 : 0.3,
            transition: "0.3s",
          }}
        >
          →
        </div>
      </div>
    </div>
  );
}
