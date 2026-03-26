interface WavyDividerProps {
  color?: string;
  flip?: boolean;
}

export function WavyDivider({ color = '#FAF8F5', flip = false }: WavyDividerProps) {
  return (
    <div className={`w-full ${flip ? 'rotate-180' : ''}`}>
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <path
          d="M0,64 C240,100 480,20 720,64 C960,108 1200,28 1440,64 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
}
