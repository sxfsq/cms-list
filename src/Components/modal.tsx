import React from "react";

export const Modal = ({ open, content, onClose }: { open?: boolean; content: React.ReactNode; onClose: () => void }) => {
    return open ? (
        <div style={{ position: "fixed", left: 0, top: 0, width: "100%", height: "100%", overflow: "auto" }}>
            <span
                style={{ cursor: "pointer", position: "fixed", top: 0, right: 10, padding: 10 , zIndex: 1}}
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
