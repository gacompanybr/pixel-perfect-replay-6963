import logoAsset from "@/assets/yama-logo-hd.png.asset.json";

type Props = {
  className?: string;
};

/**
 * Logo da YAMA Vidros e Alumínio a partir do arquivo em alta resolução enviado
 * pela empresa. O fundo azul-marinho foi removido para que o logo funcione
 * tanto no topo escuro quanto no rodapé.
 */
export function YamaLogo({ className = "" }: Props) {
  return (
    <img
      src={logoAsset.url}
      alt="YAMA Vidros e Alumínio"
      width={840}
      height={258}
      decoding="async"
      className={`object-contain ${className}`}
    />
  );
}
