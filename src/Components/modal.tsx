import { useRouter } from "next/router";
import React, { useEffect } from "react";

let zIndex = 99;

export const Modal = ({ open, content, onClose }: { open?: boolean; content: React.ReactNode; onClose: () => void }) => {
    const router = useRouter();
    useEffect(() => {
        zIndex += 1;
        return () => {
            zIndex -= 1;
        };
    }, []);

    useEffect(() => {
        open && router.push(router.asPath + "#" + zIndex);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    useEffect(() => {
        const handleBackButton = (ev: PopStateEvent) => {
            ev.preventDefault();
            onClose();
        };
        window.addEventListener("popstate", handleBackButton);
        return () => {
            window.removeEventListener("popstate", handleBackButton);
        };
    }, [onClose]);

    return open ? (
        <div style={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%", overflow: "auto", zIndex: zIndex }}>
            <span
                style={{ cursor: "pointer", position: "fixed", top: 0, right: 10, padding: 10, zIndex: 1 }}
                onClick={(e) => {
                    e.stopPropagation();
                    router.back();
                    onClose();
                }}
            >
                ✖
            </span>
            {content}
        </div>
    ) : (
        <></>
    );
};
