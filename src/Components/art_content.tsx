import { createElement, DetailedHTMLProps, Fragment, ImgHTMLAttributes, useMemo, useState } from "react";
import rehypeParse from "rehype-parse";
import rehypeReact from "rehype-react";
import { unified } from "unified";
import { Modal } from "./modal";
import { ZoomImage } from "./zoom-image";
export const ArtContent = ({ content }: { content?: string }) => {
    const [open, setOpen] = useState(false);
    const [img, setImg] = useState({ src: "", alt: "" });
    const [imgNode, setImgNode] = useState<React.ReactNode>(null);
    const processor = useMemo(() => {
        return unified()
            .use(rehypeParse, { fragment: true })
            .use(rehypeReact, {
                createElement,
                Fragment,
                components: {
                    img(props: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
                        const img = (
                            <img
                                src={props.src}
                                alt={props.alt}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setImg({ src: props.src || "", alt: props.alt || "" });
                                    setImgNode(img);
                                    setOpen(true);
                                }}
                            />
                        );
                        return img;
                    },
                },
            });
    }, []);

    const renderedContent = useMemo(() => {
        if (!content) return <></>;
        return processor.processSync(content).result;
    }, [content, processor]);
    return (
        <>
            <div className="art-content">{renderedContent}</div>
            <Modal open={open} content={<ZoomImage src={img.src} alt={img.alt} img={imgNode} />} onClose={() => setOpen(false)} />
        </>
    );
};
