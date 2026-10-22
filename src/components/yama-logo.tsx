type Props = {
  className?: string;
};

/**
 * Vetor do logo da YAMA Vidros e Alumínio, redesenhado a partir do arquivo
 * original (círculo com montanha vazada, divisória e o par "YAMA" /
 * "Vidros e Alumínio"). Sendo SVG, fica nítido em qualquer tamanho.
 */
export function YamaLogo({ className = "" }: Props) {
  return (
    <svg
      viewBox="31 62 97 30"
      className={className}
      role="img"
      aria-label="YAMA Vidros e Alumínio"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#fff"
        fillRule="evenodd"
        d="M32.75 77a13.75 13.75 0 1 0 27.5 0 13.75 13.75 0 1 0-27.5 0ZM46.5 72.6l12.1 10.6q-6.6-1.8-12.1-.2-5.5-1.6-12.1.2Z"
      />
      <rect x="62.9" y="65" width="1.7" height="24" fill="#fff" />
      <text
        x="68"
        y="80.5"
        fill="#fff"
        fontFamily="Manrope, system-ui, sans-serif"
        fontSize="13.2"
        fontWeight="800"
        letterSpacing="0"
      >
        YAMA
      </text>
      <text
        x="67"
        y="89.2"
        fill="#fff"
        fontFamily="Manrope, system-ui, sans-serif"
        fontSize="7.5"
        fontWeight="500"
        letterSpacing="0"
      >
        Vidros e Alumínio
      </text>
    </svg>
  );
}
