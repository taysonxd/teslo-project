import Image from "next/image";

interface Props {
    src: string;
    width: number | `${number}`;
    height: number | `${number}`;
    alt: string;
    className: React.StyleHTMLAttributes<HTMLImageElement>["className"];
    style?: React.StyleHTMLAttributes<HTMLImageElement>["style"];
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

export const ProductImage = ({ src, width, height, alt, className, style, onMouseEnter, onMouseLeave }: Props) => {

    const newSrc = ( src )
        ? src.startsWith('http')
            ? src
            : `/products/${src}`
            : '/imgs/placeholder.jpg';

    return (
        <Image
            src={ newSrc }
            width={ width }
            height={ height }
            alt={alt}
            className={ className }
            style={ style }
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        />
    )
}
