import React, { useEffect } from "react";

let zIndex = 99;

export const Modal = ({ open, content, onClose }: { open?: boolean; content: React.ReactNode; onClose: () => void }) => {
    useEffect(() => {
        zIndex += 1;
        return () => {
            zIndex -= 1;
        };
    }, []);
    return open ? (
        <div style={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%", overflow: "auto", zIndex: zIndex }}>
            <span
                style={{ cursor: "pointer", position: "fixed", top: 0, right: 10, padding: 10, zIndex: 1 }}
                onClick={(e) => {
                    e.stopPropagation();
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
