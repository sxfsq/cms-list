import React, { useMemo, useState } from "react";

export const ScroolContain = (
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
        onScroolEnd?: () => void;
        onScroolTop?: () => void;
    }
) => {
    const domRef = useMemo(() => React.createRef<HTMLDivElement>(), []);
    const [xy, setXY] = useState({ x: 0, y: 0 });
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
                    onScroolEnd && onScroolEnd();
                } else if (ele.scrollTop <= 10 && e.deltaY < 0) {
                    onScroolTop && onScroolTop();
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
