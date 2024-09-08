import React, { useMemo, useState } from "react";

export const ScroolContain = (
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        onScroolEnd?: () => void;
        onScroolTop?: () => void;
    }
) => {
    const domRef = useMemo(() => React.createRef<HTMLDivElement>(), []);
    const [xy, setXY] = useState({ x: 0, y: 0 });
    const [flag, setFlag] = useState<"none" | "top" | "top1" | "end" | "end1">("none");
    const { children, onScroolEnd, onScroolTop } = props;
    const _props = { ...props };
    delete _props.onScroolEnd;
    delete _props.onScroolTop;
    if (_props.style) _props.style.overscrollBehavior = "contain";
    else _props.style = { overscrollBehavior: "contain" };

    return (
        <div
            {..._props}
            ref={domRef}
            onWheel={(e) => {
                let ele = domRef.current;
                if (!ele) return;
                if (ele.scrollTop + ele.offsetHeight >= ele.scrollHeight - 400 && e.deltaY > 0) {
                    setFlag("end");
                    // setTimeout(() => {
                    //     setFlag((flag) => (flag == "end" ? "end1" : flag));
                    // }, 200);
                    // setTimeout(() => {
                    //     setFlag((flag) => (flag == "end" || flag == "end1" ? "none" : flag));
                    // }, 400);
                    onScroolEnd && onScroolEnd();
                } else if (ele.scrollTop <= 10 && e.deltaY < 0) {
                    setFlag("top");
                    setTimeout(() => {
                        setFlag((flag) => (flag == "top" ? "top1" : flag));
                    }, 200);
                    setTimeout(() => {
                        setFlag((flag) => (flag == "top" || flag == "top1" ? "none" : flag));
                    }, 400);
                    onScroolTop && flag == "top1" && onScroolTop();
                }
            }}
            onTouchStart={(e) => {
                if (e.changedTouches[0]) setXY({ x: e.changedTouches[0].screenX, y: e.changedTouches[0].screenY });
            }}
            onTouchEnd={(e) => {
                if (e.changedTouches[0]) {
                    if (Math.abs(e.changedTouches[0].screenX - xy.x) < Math.abs(e.changedTouches[0].screenY - xy.y)) {
                        let ele = domRef.current;
                        if (!ele) return;
                        if (ele.scrollTop + ele.offsetHeight >= ele.scrollHeight - 400 && e.changedTouches[0].screenY - xy.y < -50) {
                            onScroolEnd && onScroolEnd();
                        } else if (ele.scrollTop <= 10 && e.changedTouches[0].screenY - xy.y > 50) {
                            onScroolTop && onScroolTop();
                        }
                    }
                }
            }}
        >
            {children}
        </div>
    );
};
