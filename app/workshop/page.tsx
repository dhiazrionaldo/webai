"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const SYSTEMS_L = [
  { label: "NEURAL CORES",  delay: 0.0, dur: 0.9 },
  { label: "QUANTUM MESH",  delay: 0.1, dur: 0.7 },
  { label: "MEMORY BANKS",  delay: 0.2, dur: 1.1 },
  { label: "VISION MODULE", delay: 0.3, dur: 0.6 },
];
const SYSTEMS_R = [
  { label: "LANG MODEL",    delay: 0.05, dur: 1.0 },
  { label: "INFERENCE ENG", delay: 0.15, dur: 0.75 },
  { label: "SAFETY CORE",   delay: 0.25, dur: 0.5 },
  { label: "API BRIDGE",    delay: 0.35, dur: 0.8 },
];

function easeInExpo(t: number) {
  return t === 0 ? 0 : Math.pow(2, 10 * t - 10);
}

function SystemBar({ label, delay, dur }: { label: string; delay: number; dur: number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span style={{ fontFamily:"Courier New", fontSize:7.5, letterSpacing:"0.15em", color:"rgba(0,238,255,0.55)", textTransform:"uppercase" }}>
        {label}
      </span>
      <div style={{ height:1, background:"rgba(0,238,255,0.1)", overflow:"hidden" }}>
        <motion.div
          style={{ height:1, background:"#00eeff", originX:0 }}
          initial={{ scaleX:0 }}
          animate={{ scaleX:1 }}
          transition={{ duration:dur, delay:1.1+delay, ease:"easeOut" }}
        />
      </div>
    </div>
  );
}

export default function IntroPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"intro" | "warp">("intro");
  const [pct, setPct] = useState(0);
  const bgCanvasRef   = useRef<HTMLCanvasElement>(null);
  const warpCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgAnimRef     = useRef<number>(0);
  const warpAnimRef   = useRef<number>(0);

  /* ── Background particles ── */
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    type Pt = { x:number; y:number; vx:number; vy:number; r:number; op:number; ph:number; hue:number };
    let W=0, H=0, pts:Pt[]=[];

    const resize = () => {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W; canvas.height = H;
      pts = Array.from({ length:100 }, () => ({
        x:Math.random()*W, y:Math.random()*H,
        vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
        r:Math.random()*1.5+.5, op:Math.random()*.5+.1,
        ph:Math.random()*Math.PI*2,
        hue:Math.random()<.85?185:Math.random()<.5?200:160,
      }));
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0,0,W,H);
      const t = Date.now()/1000;

      ctx.strokeStyle="rgba(0,220,255,0.03)"; ctx.lineWidth=.5;
      for(let x=0;x<W;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke()}
      for(let y=0;y<H;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke()}

      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.ph+=.015;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0;
        if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        const op=p.op*(.6+.4*Math.sin(p.ph));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`hsla(${p.hue},100%,70%,${op})`; ctx.fill();
        if(p.r>1){
          ctx.beginPath(); ctx.arc(p.x,p.y,p.r*2.5,0,Math.PI*2);
          ctx.fillStyle=`hsla(${p.hue},100%,70%,${op*.12})`; ctx.fill();
        }
      });

      for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){
          ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(0,200,255,${.12*(1-d/110)})`; ctx.lineWidth=.5; ctx.stroke();
        }
      }

      const cx=W/2, cy=H/2;
      for(let i=0;i<3;i++){
        const r=80+i*55, sp=.15+i*.08, ph=t*sp+i*Math.PI/3;
        const px=cx+r*Math.cos(ph), py=cy+r*Math.sin(ph);
        ctx.beginPath(); ctx.arc(px,py,2.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(0,230,255,${.35-i*.07})`; ctx.fill();
        ctx.beginPath(); ctx.arc(px,py,6,0,Math.PI*2);
        ctx.fillStyle="rgba(0,230,255,0.06)"; ctx.fill();
      }

      const beams=[[cx,0,cx,cy],[0,cy,cx,cy],[W,cy,cx,cy],[cx,H,cx,cy]] as const;
      beams.forEach(([x1,y1,x2,y2])=>{
        const g=ctx.createLinearGradient(x1,y1,x2,y2);
        g.addColorStop(0,"transparent"); g.addColorStop(1,"rgba(0,200,255,0.05)");
        ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2);
        ctx.strokeStyle=g; ctx.lineWidth=50; ctx.stroke();
      });

      bgAnimRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(bgAnimRef.current); window.removeEventListener("resize",resize); };
  }, []);

  /* ── 3D Warp tunnel then navigate ── */
  const runWarp = useCallback(() => {
    const canvas = warpCanvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W=canvas.width, H=canvas.height;
    const cx=W/2, cy=H/2;
    const t0=performance.now();
    const DURATION=1600;

    const frame = (now: number) => {
      const elapsed=now-t0;
      const t=elapsed/1000;
      const prog=Math.min(elapsed/DURATION,1);
      const speed=easeInExpo(prog);

      ctx.clearRect(0,0,W,H);

      const layers=32;
      for(let i=0;i<layers;i++){
        const frac=((i/layers)+(t*.7)%1);
        const z=1-frac;
        const scale=1/(z+.001);
        const size=Math.min(scale*55, Math.max(W,H)*2.8);
        const baseAlpha=z*(.5+speed*.5)*(1-Math.pow(frac,.5)*.3);
        const sides=6;

        const drawPoly=(sz:number,rot:number,alpha:number,lw:number,hue:number,lum:number)=>{
          ctx.beginPath();
          for(let s=0;s<sides;s++){
            const angle=(s/sides)*Math.PI*2+rot;
            const px=cx+Math.cos(angle)*sz;
            const py=cy+Math.sin(angle)*sz*.62;
            s===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
          }
          ctx.closePath();
          ctx.strokeStyle=`hsla(${hue},100%,${lum}%,${Math.min(alpha,.9)})`;
          ctx.lineWidth=lw; ctx.stroke();
        };

        const hue=185+Math.sin(frac*Math.PI)*20;
        drawPoly(size,t*.15,baseAlpha,(.5+speed*2)*(1-frac*.4),hue,65);
        if(i%3===0) drawPoly(size*.72,t*.28+Math.PI/6,baseAlpha*.4,.5,hue+20,88);
      }

      const streaks=36;
      for(let i=0;i<streaks;i++){
        const angle=(i/streaks)*Math.PI*2;
        const wobble=Math.sin(t*3+i*.5)*.04;
        const innerR=15+speed*8;
        const outerR=innerR+20+speed*340*(.8+wobble);
        const sx=cx+Math.cos(angle)*innerR, sy=cy+Math.sin(angle)*innerR*.62;
        const ex=cx+Math.cos(angle)*outerR, ey=cy+Math.sin(angle)*outerR*.62;
        const g=ctx.createLinearGradient(sx,sy,ex,ey);
        g.addColorStop(0,`rgba(0,238,255,${.7*speed})`);
        g.addColorStop(.6,`rgba(0,180,255,${.3*speed})`);
        g.addColorStop(1,"transparent");
        ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey);
        ctx.strokeStyle=g; ctx.lineWidth=.8+speed*2; ctx.stroke();
      }

      if(speed>.05){
        const g2=ctx.createRadialGradient(cx,cy,0,cx,cy,speed*Math.min(W,H)*.75);
        g2.addColorStop(0,`rgba(120,240,255,${.3*speed})`);
        g2.addColorStop(.3,`rgba(0,180,255,${.15*speed})`);
        g2.addColorStop(1,"transparent");
        ctx.fillStyle=g2; ctx.fillRect(0,0,W,H);
      }

      const flash=Math.max(0,(prog-.82)/.18);
      if(flash>0){ ctx.fillStyle=`rgba(200,245,255,${flash*.9})`; ctx.fillRect(0,0,W,H); }

      if(prog<1){
        warpAnimRef.current=requestAnimationFrame(frame);
      } else {
        /* Navigate to main page after warp completes */
        router.push("/main");
      }
    };
    warpAnimRef.current=requestAnimationFrame(frame);
  }, [router]);

  /* ── Progress counter ── */
  useEffect(()=>{
    let v=0;
    const iv=setInterval(()=>{
      v=Math.min(v+Math.random()*3+1,100);
      setPct(Math.round(v));
      if(v>=100) clearInterval(iv);
    },60);
    return ()=>clearInterval(iv);
  },[]);

  const handleInitialize = useCallback(()=>{
    setPhase("warp");
    requestAnimationFrame(()=>{
      const canvas=warpCanvasRef.current;
      if(canvas){ canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight; }
      runWarp();
    });
  },[runWarp]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <canvas ref={bgCanvasRef} className="absolute inset-0 h-full w-full" />

      <AnimatePresence>
        {phase==="intro" && (
          <motion.div key="intro" className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity:0, scale:1.4, filter:"blur(16px)" }}
            transition={{ duration:.45, ease:[.4,0,1,1] }}>

            {[0,-2].map((delay,i)=>(
              <motion.div key={i} className="pointer-events-none absolute left-0 w-full"
                style={{ height:1, background:"linear-gradient(90deg,transparent,#00eeff,#fff,#00eeff,transparent)", opacity:i===0?.55:.2 }}
                animate={{ top:["-1%","101%"] }}
                transition={{ duration:4, delay, repeat:Infinity, ease:"linear" }} />
            ))}

            {["top-4 left-4 border-t border-l","top-4 right-4 border-t border-r","bottom-4 left-4 border-b border-l","bottom-4 right-4 border-b border-r"].map((cls,i)=>(
              <motion.div key={i} className={`absolute h-7 w-7 border-cyan-400 ${cls}`}
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.5+i*.06 }} />
            ))}

            {[
              { cls:"left-0 w-full h-px", style:{ top:"30%" } },
              { cls:"left-0 w-full h-px", style:{ top:"70%" } },
              { cls:"top-0 h-full w-px", style:{ left:"18%" } },
              { cls:"top-0 h-full w-px", style:{ left:"82%" } },
            ].map(({ cls, style },i)=>(
              <motion.div key={i} className={`pointer-events-none absolute bg-cyan-400/20 ${cls}`} style={style}
                initial={{ scaleX:cls.includes("w-full")?0:1, scaleY:cls.includes("h-full")?0:1 }}
                animate={{ scaleX:1, scaleY:1 }}
                transition={{ delay:.7+i*.05, duration:.8, ease:"easeOut" }} />
            ))}

            <motion.div className="relative z-10 flex flex-col items-center gap-4"
              initial={{ scale:5, opacity:0, filter:"blur(40px)" }}
              animate={{ scale:1, opacity:1, filter:"blur(0px)" }}
              transition={{ duration:1.3, delay:.15, ease:[.16,1,.3,1] }}>

              <motion.p style={{ fontFamily:"Courier New", fontSize:8, letterSpacing:"0.3em", color:"rgba(0,238,255,0.6)", textTransform:"uppercase" }}
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:.9 }}>
                ◈ MULIA AI Center v7.4.1 ◈
              </motion.p>

              <motion.div className="flex items-center gap-14" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.0 }}>
                <div className="flex flex-col gap-2.5">
                  {SYSTEMS_L.map(s=><SystemBar key={s.label} {...s} />)}
                </div>

                <motion.div className="relative h-44 w-44"
                  initial={{ scale:0, rotate:-360, opacity:0 }}
                  animate={{ scale:1, rotate:0, opacity:1 }}
                  transition={{ delay:.2, duration:.8, ease:[.16,1,.3,1] }}>
                  {[
                    { size:176, dur:20, rev:false, style:{ border:"1px solid rgba(0,238,255,0.2)" } },
                    { size:154, dur:13, rev:true,  style:{ border:"1px dashed rgba(0,238,255,0.4)" } },
                    { size:128, dur:8,  rev:false, style:{ border:"2px solid #00eeff", boxShadow:"0 0 14px #00eeff,inset 0 0 14px rgba(0,238,255,0.15)" } },
                    { size:96,  dur:5,  rev:true,  style:{ border:"1px solid rgba(0,238,255,0.6)" } },
                    { size:64,  dur:3,  rev:false, style:{ border:"2px solid #00eeff", boxShadow:"0 0 8px #00eeff" } },
                  ].map(({ size, dur, rev, style },i)=>(
                    <motion.div key={i} className="absolute rounded-full"
                      style={{ width:size, height:size, top:"50%", left:"50%", marginTop:-size/2, marginLeft:-size/2, ...style }}
                      animate={{ rotate:rev?-360:360 }}
                      transition={{ duration:dur, repeat:Infinity, ease:"linear" }} />
                  ))}
                  <svg style={{ position:"absolute", top:"50%", left:"50%", width:176, height:176, marginLeft:-88, marginTop:-88 }} viewBox="0 0 176 176">
                    <motion.circle cx="88" cy="88" r="82" fill="none" stroke="#00eeff" strokeWidth=".8" strokeDasharray="6 18" opacity=".35"
                      animate={{ rotate:360 }} transition={{ duration:30, repeat:Infinity, ease:"linear" }} style={{ transformOrigin:"88px 88px" }} />
                    <motion.circle cx="88" cy="88" r="55" fill="none" stroke="#00eeff" strokeWidth=".8" strokeDasharray="3 22" opacity=".25"
                      animate={{ rotate:-360 }} transition={{ duration:20, repeat:Infinity, ease:"linear" }} style={{ transformOrigin:"88px 88px" }} />
                  </svg>
                  {[0,90,180,270].map(deg=>(
                    <div key={deg} style={{ position:"absolute", width:8, height:2, background:"#00eeff", top:"50%", left:"50%",
                      marginTop:-1, marginLeft:-4, transformOrigin:"4px 1px", transform:`rotate(${deg}deg) translateX(85px)`, opacity:.7 }} />
                  ))}
                  <motion.div className="absolute rounded-full"
                    style={{ width:40, height:40, top:"50%", left:"50%", marginTop:-20, marginLeft:-20,
                      background:"radial-gradient(circle,#fff 0%,#88ffff 30%,#00eeff 60%,#0044ff 90%,transparent 100%)" }}
                    animate={{ boxShadow:[
                      "0 0 18px #00eeff,0 0 36px rgba(0,238,255,0.7),0 0 70px rgba(0,238,255,0.3)",
                      "0 0 28px #00ffff,0 0 60px rgba(0,238,255,0.9),0 0 110px rgba(0,238,255,0.5)",
                      "0 0 18px #00eeff,0 0 36px rgba(0,238,255,0.7),0 0 70px rgba(0,238,255,0.3)",
                    ], scale:[1,1.12,1] }}
                    transition={{ duration:2, repeat:Infinity, ease:"easeInOut" }} />
                </motion.div>

                <div className="flex flex-col gap-2.5 items-end">
                  {SYSTEMS_R.map(s=><SystemBar key={s.label} {...s} />)}
                </div>
              </motion.div>

              <motion.div className="flex flex-col items-center gap-1"
                initial={{ opacity:0, filter:"blur(12px)" }}
                animate={{ opacity:1, filter:"blur(0px)" }}
                transition={{ delay:1.4, duration:.6 }}>
                <p style={{ fontFamily:"Courier New", fontSize:9, letterSpacing:"0.35em", color:"#00eeff", textTransform:"uppercase", textShadow:"0 0 10px #00eeff" }}>
                  ◆ Intelligence Platform ◆
                </p>
                <h1 style={{ fontFamily:"Courier New", fontSize:42, fontWeight:700, color:"#fff", letterSpacing:"0.4em", textTransform:"uppercase",
                  textShadow:"0 0 30px rgba(0,238,255,0.7),0 0 70px rgba(0,238,255,0.35)" }}>
                    MULIA AI CENTER
                </h1>
                <p style={{ fontFamily:"Courier New", fontSize:9, letterSpacing:"0.3em", color:"rgba(0,238,255,0.6)", textTransform:"uppercase" }}>
                  — Interactive · Adaptive · Advanced —
                </p>
              </motion.div>

              <motion.div className="flex items-center gap-3" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.8 }}>
                {[0,.4,.8].map((d,i)=>(
                  <motion.div key={i} style={{ width:5, height:5, borderRadius:"50%", background:"#00eeff" }}
                    animate={{ opacity:[1,.2,1] }} transition={{ duration:1.2, delay:d, repeat:Infinity }} />
                ))}
                <p style={{ fontFamily:"Courier New", fontSize:8, letterSpacing:"0.2em", color:"rgba(0,238,255,0.6)", textTransform:"uppercase" }}>
                  All systems nominal
                </p>
              </motion.div>

              <motion.button
                className="group relative overflow-hidden"
                style={{ border:"1px solid #00eeff", background:"transparent", color:"#00eeff", padding:"10px 40px",
                  fontFamily:"Courier New", fontSize:9, letterSpacing:"0.35em", textTransform:"uppercase", cursor:"pointer" }}
                initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:3 }}
                whileHover={{ boxShadow:"0 0 24px rgba(0,238,255,0.5),inset 0 0 24px rgba(0,238,255,0.15)" }}
                whileTap={{ scale:.97 }}
                onClick={handleInitialize}>
                <motion.span className="absolute inset-0 bg-cyan-400"
                  initial={{ x:"-101%" }} whileHover={{ x:0 }} transition={{ duration:.3 }} />
                <span className="relative z-10 group-hover:text-white transition-colors">◈ &nbsp; Initialize &nbsp; ◈</span>
              </motion.button>
            </motion.div>

            <motion.div className="absolute bottom-5 left-10 right-10" initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:2 }}>
              <div style={{ height:1, background:"rgba(0,238,255,0.08)", overflow:"hidden" }}>
                <motion.div style={{ height:1, background:"linear-gradient(90deg,transparent,#00eeff,#fff)", boxShadow:"0 0 8px #00eeff", originX:0 }}
                  initial={{ scaleX:0 }} animate={{ scaleX:1 }} transition={{ duration:2.2, delay:2, ease:"easeOut" }} />
              </div>
              <p style={{ fontFamily:"Courier New", fontSize:7, color:"rgba(0,238,255,0.5)", letterSpacing:"0.15em", marginTop:4, textAlign:"right" }}>
                {pct}%
              </p>
            </motion.div>
            <p style={{ position:"absolute", bottom:6, fontFamily:"Courier New", fontSize:7, color:"rgba(0,238,255,0.2)", letterSpacing:"0.2em", whiteSpace:"nowrap" }}>
              SECURE CHANNEL ESTABLISHED · ENCRYPTION: AES-512 · LATENCY: 0.4ms
            </p>
          </motion.div>
        )}

        {phase==="warp" && (
          <motion.div key="warp" className="absolute inset-0"
            initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:.2 }}>
            <canvas ref={warpCanvasRef} className="absolute inset-0 h-full w-full" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}