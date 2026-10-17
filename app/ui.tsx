'use client';
import { useEffect } from 'react';
export default function AppClient() {
  useEffect(() => { let disposed = false; let cleanup: (() => void) | undefined; import('../src/main').then(m => { if (!disposed) cleanup = m.mountLifeAtlas(); }); return () => { disposed = true; cleanup?.(); }; }, []);
  return <>
    <a className="skip" href="#main">跳到主要内容</a>
    <div id="app"/>
    <dialog id="modal" aria-labelledby="dialog-title"/>
    <div id="toast" role="status" aria-live="polite"/>
  </>;
}
