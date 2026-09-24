import { AbsoluteFill, Easing, interpolate, interpolateColors, useCurrentFrame } from 'remotion';

// Replace this demonstration content and surface with the real product.
// Keep the scene IDs aligned with edit.json and cues.example.json.
export const shots: Record<string, { duration: number; eyebrow: string; line: string; detail: string; accent: string }> = {
  context: { duration: 75, eyebrow: 'CONTEXT', line: 'Show the product', detail: 'Replace this demo surface with the real interface.', accent: '#7c66dc' },
  tension: { duration: 60, eyebrow: 'BEFORE', line: 'Show the friction', detail: 'Make the starting state visible.', accent: '#d77a56' },
  action: { duration: 90, eyebrow: 'ACTION', line: 'Show one change', detail: 'Animate the actual interaction.', accent: '#6296a8' },
  result: { duration: 75, eyebrow: 'AFTER', line: 'Hold the result', detail: 'Show the state that proves the claim.', accent: '#79a783' },
};
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const enter = (frame: number, delay = 0) => interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

export function Scene({ scene, startAt = 0 }: { scene: string; startAt?: number }) {
  const frame = useCurrentFrame() + startAt;
  const shot = shots[scene];
  if (!shot) throw Error(`Unknown scene: ${scene}`);
  const opacity = enter(frame);
  const result = scene === 'result';
  const actionColor = interpolateColors(frame, [44, 60], ['#eceef2', shot.accent]);
  const zoom = interpolate(frame, [0, shot.duration], [1, 1.07], { extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: '#f5f4f1', color: '#222431', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', inset: 100, display: 'flex', gap: 100, alignItems: 'center' }}>
      <div style={{ width: 650, opacity, transform: `translateY(${(1 - opacity) * 30}px)` }}>
        <div style={{ color: shot.accent, fontSize: 26, letterSpacing: 6, fontWeight: 700 }}>{shot.eyebrow}</div>
        <h1 style={{ fontSize: 100, lineHeight: 1.02, letterSpacing: -5, margin: '34px 0' }}>{shot.line}</h1>
        <p style={{ fontSize: 34, lineHeight: 1.3, color: '#626574', margin: 0 }}>{shot.detail}</p>
      </div>
      <div style={{ width: 950, height: 680, borderRadius: 28, background: '#fff', boxShadow: '0 40px 100px #25254422', transform: `scale(${zoom})`, overflow: 'hidden' }}>
        <div style={{ height: 72, display: 'flex', alignItems: 'center', gap: 15, borderBottom: '1px solid #e5e6ec', padding: '0 28px' }}>
          <span style={{ width: 20, height: 20, borderRadius: 20, background: shot.accent }} />
          <span style={{ fontSize: 22, fontWeight: 700 }}>Replace with product UI</span>
        </div>
        <div style={{ padding: 50 }}>
          <div style={{ height: 32, width: 320, background: '#dddfe6', borderRadius: 8, marginBottom: 30 }} />
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ height: 330, width: 510, background: '#f0f1f5', borderRadius: 16 }} />
            <div style={{ flex: 1 }}>
              {[0, 1, 2].map((n) => <div key={n} style={{ height: 82, background: n === 1 && scene === 'action' ? actionColor : n === 1 && result ? shot.accent : '#eceef2', opacity: result && n === 1 ? enter(frame, 24) : enter(frame, n * 5), borderRadius: 12, marginBottom: 22 }} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  </AbsoluteFill>;
}
