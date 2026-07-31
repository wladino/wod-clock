import { Link } from 'react-router-dom';

const MODES = [
  { path: '/tabata', label: 'TABATA' },
  { path: '/fortime', label: 'FOR TIME' },
  { path: '/emom', label: 'EMOM' },
  { path: '/amrap', label: 'AMRAP' },
];

export default function Home() {
  function handleShare() {
    const shareData = { title: 'Workout Clock', url: window.location.href };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareData.url).catch(() => {});
    }
  }

  return (
    <div className="screen">
      <div className="screen-main">
        <div className="home-list">
          {MODES.map((m) => (
            <Link key={m.path} to={m.path} className="mode-row">
              {m.label}
              <span className="chevron">&#8250;</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="footer">
        <button className="link" onClick={handleShare}>SHARE</button>
      </div>
    </div>
  );
}
