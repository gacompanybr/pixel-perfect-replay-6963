import logoAsset from "@/assets/yama-logo.png.asset.json";

type Props = {
  className?: string;
};

/**
 * Logo da YAMA Vidros e Alumínio a partir do arquivo enviado pela empresa.
 * O fundo azul-marinho foi removido para que o logo funcione tanto no topo
 * escuro quanto no rodapé.
 */
export function YamaLogo({ className = "" }: Props) {
  return (
    <img
      src={logoAsset.url}
      alt="YAMA Vidros e Alumínio"
      width={594}
      height={198}
      decoding="async"
      className={`object-contain ${className}`}
    />
  );
}
