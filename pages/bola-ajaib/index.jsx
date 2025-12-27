import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Amazing() {
  const ballEl = useRef(null);
  const [dragging, setDragging] = useState(false);
  const id = useRef(Math.random().toString(36).substring(7));

  const throwState = useRef({
    speedX: 20,
    speedY: 15,
    lastX: 0,
    lastY: 0,
    grabOffsetX: 0,
    grabOffsetY: 0,
  });

  useEffect(() => {
    if (!localStorage.getItem('portal_pos')) {
      localStorage.setItem('portal_pos', JSON.stringify({
        x: window.screen.availWidth / 2,
        y: window.screen.availHeight / 2,
        speedX: 20,
        speedY: 15,
        held: false,
        owner: id.current,
        t: Date.now()
      }));
    }

    let raf;
    const loop = () => {
      let ball = JSON.parse(localStorage.getItem('portal_pos') || '{}');
      
      if (ball.x === undefined || ball.x === null) {
        ball = { x: 500, y: 500, speedX: 0, speedY: 0, held: false, owner: id.current, t: Date.now() };
      }

      const isMaster = ball.owner === id.current || (Date.now() - ball.t > 100);

      if (!ball.held && isMaster) {
        ball.owner = id.current;
        ball.t = Date.now();
        ball.x += ball.speedX;
        ball.y += ball.speedY;

        ball.speedX *= 0.98;
        ball.speedY *= 0.98;

        const w = window.screen.availWidth;
        const h = window.screen.availHeight;

        if (ball.x <= 0) {
          ball.x = 0;
          ball.speedX *= -0.8;
        } else if (ball.x + 80 >= w) {
          ball.x = w - 80;
          ball.speedX *= -0.8;
        }

        if (ball.y <= 0) {
          ball.y = 0;
          ball.speedY *= -0.8;
        } else if (ball.y + 80 >= h) {
          ball.y = h - 80;
          ball.speedY *= -0.8;
        }

        localStorage.setItem('portal_pos', JSON.stringify(ball));
      }

      const x = ball.x - window.screenX;
      const y = ball.y - window.screenY;

      if (ballEl.current) {
        ballEl.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        ballEl.current.style.cursor = ball.held ? 'grabbing' : 'grab';
      }

      raf = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleDown = (e) => {
    e.preventDefault();
    setDragging(true);

    let ball = JSON.parse(localStorage.getItem('portal_pos') || '{}');
    ball.held = true;
    ball.owner = id.current;
    ball.t = Date.now();
    localStorage.setItem('portal_pos', JSON.stringify(ball));

    throwState.current.grabOffsetX = ball.x - e.screenX;
    throwState.current.grabOffsetY = ball.y - e.screenY;
    throwState.current.lastX = e.screenX;
    throwState.current.lastY = e.screenY;
    throwState.current.speedX = 0;
    throwState.current.speedY = 0;
  };

  const handleMove = (e) => {
    if (!dragging) return;

    const dx = e.screenX - throwState.current.lastX;
    const dy = e.screenY - throwState.current.lastY;

    throwState.current.lastX = e.screenX;
    throwState.current.lastY = e.screenY;
    throwState.current.speedX = dx;
    throwState.current.speedY = dy;

    let ball = JSON.parse(localStorage.getItem('portal_pos') || '{}');
    ball.x = e.screenX + throwState.current.grabOffsetX;
    ball.y = e.screenY + throwState.current.grabOffsetY;
    ball.owner = id.current;
    ball.t = Date.now();
    localStorage.setItem('portal_pos', JSON.stringify(ball));
  };

  const handleUp = () => {
    if (!dragging) return;
    setDragging(false);

    let ball = JSON.parse(localStorage.getItem('portal_pos') || '{}');
    ball.held = false;
    ball.owner = id.current;
    ball.t = Date.now();
    ball.speedX = throwState.current.speedX * 1.5;
    ball.speedY = throwState.current.speedY * 1.5;
    localStorage.setItem('portal_pos', JSON.stringify(ball));
  };

  return (
    <div className="overlay-container" onMouseMove={handleMove} onMouseUp={handleUp} onMouseLeave={handleUp}>
      <Head><title>Portal Ball</title></Head>

      <Link href="/">
        <button className="btn-exit">← KELUAR</button>
      </Link>

      <div className="hud-instruction">
        <h4>Bola ajaib</h4>
        <p>1. Buka url ini di window yang lain(browsernya samain ya:v)</p>
        <p>2. Posisikan window kiri & kanan</p>
        <p>3. Lempar bola ke pojok layar</p>
      </div>

      <div ref={ballEl} className="the-ball" onMouseDown={handleDown} />

      <style jsx>{`
        .overlay-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: white;
          z-index: 2147483647;
          overflow: hidden;
          font-family: monospace;
          color: black;
        }

        .btn-exit {
          position: absolute;
          top: 20px;
          left: 20px;
          background: black;
          color: white;
          border: none;
          padding: 10px 20px;
          font-weight: bold;
          cursor: pointer;
          font-family: inherit;
          z-index: 100;
        }

        .hud-instruction {
          position: absolute;
          top: 20px;
          right: 20px;
          text-align: right;
          border: 2px solid black;
          padding: 15px;
          background: rgba(255,255,255,0.9);
          pointer-events: none;
          user-select: none;
          z-index: 100;
        }

        .the-ball {
          width: 80px;
          height: 80px;
          background: black;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 50;
          will-change: transform;
        }
      `}</style>

      <style jsx global>{`
        body {
          margin: 0 !important;
          padding: 0 !important;
          overflow: hidden !important;
          background: white !important;
        }

        * {
          cursor: auto;
        }
      `}</style>
    </div>
  );
}
