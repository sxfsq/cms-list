import { Art } from "@/model/art";
import { useState } from "react";
import { ArtContent } from "./art_content";
import { Modal } from "./modal";
import { ScroolContain } from "./scrool_contain";

export const ArtList = ({
    arts,
    onType,
    onScroolEnd,
    onScroolTop,
}: {
    arts: Art[];
    onType: (tid: number) => void;
    onScroolEnd: () => void;
    onScroolTop: () => void;
}) => {
    const [detail, setDetail] = useState<Art>();
    const [showDetail, setShowDetail] = useState(false);
    return (
        <ScroolContain
            onScroolTop={onScroolTop}
            onScroolEnd={onScroolEnd}
            className="art-list"
        >
            {arts.map((v, i) => {
                return (
                    <div
                        className="art-item"
                        style={{ width: v.art_pic && v.art_pic.startsWith("http") ? "min(clamp(240px, 25%, 360px), 100%)" : undefined }}
                        key={v.art_id + "_" + i}
                        onClick={() => {
                            setDetail(v);
                            setShowDetail(true);
                        }}
                    >
                        {v.art_pic && v.art_pic.startsWith("http") && <img className="art-pic" alt={v.art_name} src={v.art_pic} />}
                        <div className="art-info">
                            <div className="art-name">{v.art_name}</div>
                            <div className="art-blurb">{v.art_blurb}</div>
                            <div className="art-info-footer">
                                <span className="art-time">{v.art_time}</span>
                                <span
                                    className="art-class"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onType(v.type_id);
                                    }}
                                >
                                    {v.type_name}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
            <Modal
                open={showDetail}
                content={
                    <div className="art-detail" style={{ padding: "16px", backgroundColor: "var(--background)" }}>
                        <h3 style={{ marginBottom: 10 }}>{detail?.art_name}</h3>
                        <ArtContent content={detail?.art_content} />
                    </div>
                }
                onClose={() => setShowDetail(false)}
            ></Modal>
        </ScroolContain>
    );
};
