import { Video } from "@/model/video";
import { useState } from "react";
import { Modal } from "./modal";
import { Player } from "./player";
import { ScroolContain } from "./scrool_contain";

export const VideoList = ({
    vods,
    onType,
    onScroolEnd,
    onScroolTop,
}: {
    vods: Video[];
    onType: (tid: number) => void;
    onScroolEnd: () => void;
    onScroolTop: () => void;
}) => {
    const [detail, setDetail] = useState<Video>();
    const [showDetail, setShowDetail] = useState(false);

    return (
        <ScroolContain onScroolTop={onScroolTop} onScroolEnd={onScroolEnd} className="vod-list">
            {vods.map((v, i) => {
                return (
                    <div
                        className="vod-item"
                        key={v.vod_id + "_" + i}
                        onClick={() => {
                            setDetail(v);
                            setShowDetail(true);
                        }}
                    >
                        <img className="vod-pic" alt={v.vod_name} src={v.vod_pic} />
                        <div className="vod-info">
                            <div className="vod-name" onClick={(e) => e.stopPropagation()} dangerouslySetInnerHTML={{ __html: v.vod_name || "" }} />
                            {/* <span style={{ flex: 1 }}></span> */}
                            <div className="vod-info-footer">
                                <span className="vod-duration">{v.vod_duration}</span>
                                <span className="vod-time">
                                    {v.vod_pubdate}{" "}
                                    <span
                                        className="vod-class"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onType(v.type_id);
                                        }}
                                    >
                                        {v.type_name}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
            {/* <div style={{ flex: "auto" }}></div> */}
            <Modal open={showDetail} onClose={() => setShowDetail(false)} content={<Player detail={detail} />} />
        </ScroolContain>
    );
};
