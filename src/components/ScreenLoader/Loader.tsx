import "./Loader.css"
const Loader: React.FC = () => {
  return (
   <div className="screenloader">
    <aside className="container-loader">
      {Array.from({ length: 15 }, (_, i) => (
        <div
          key={i}
          className="aro"
          style={{ "--s": i } as React.CSSProperties}
        ></div>
      ))}
    </aside>
   </div>
  );
};

export default Loader;
