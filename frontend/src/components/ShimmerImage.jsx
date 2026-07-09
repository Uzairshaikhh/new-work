import { useState } from "react";

const ShimmerImage = ({ src, alt, className = "", width, height, ...props }) => {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#15151a] overflow-hidden">
      {!loaded && !errored && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#15151a] via-[#1e1e26] to-[#15151a] animate-shimmer" />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`${className} transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
        {...props}
      />
    </div>
  );
};

export default ShimmerImage;
