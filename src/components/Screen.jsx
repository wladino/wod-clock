export default function Screen({ header, footer, children }) {
  return (
    <div className="screen">
      <div className="header">{header}</div>
      <div className="screen-main">{children}</div>
      <div className="footer">{footer}</div>
    </div>
  );
}
