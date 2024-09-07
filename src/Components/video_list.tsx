import { Video } from "@/model/video";
import { useEffect, useState } from "react";
import VidyardPlayer from "react-player";
import { Modal } from "./modal";

export const VideoList = ({ vods, onType, onScroolEnd }: { vods: Video[]; onType: (tid: number) => void; onScroolEnd: () => void }) => {
    const [detail, setDetail] = useState<Video>();
    const [showDetail, setShowDetail] = useState(false);
    const [vodUrlList, setVodUrlList] = useState<{ name: string; url: string }[]>([]);
    const [currentUrl, setCurrentUrl] = useState("");
    useEffect(() => {
        const urlList = detail?.vod_play_url?.split("#") || [];
        setVodUrlList((vodList) => {
            vodList.length = 0;
            urlList.forEach((v) => {
                vodList.push({ name: v.split("$")[0], url: v.split("$")[1] });
            });
            const url = vodList[0]?.url || "";
            setCurrentUrl(vodList[0]?.url || "");
            console.log("url: " + url + " can play:" + VidyardPlayer.canPlay(vodList[0]?.url));
            return [...vodList];
        });
    }, [detail]);
    return (
        <div
            className="vod-list"
            onScroll={(e) => {
                const ele = e.target as HTMLDivElement;
                if (ele.scrollTop + ele.offsetHeight >= ele.scrollHeight - 400) {
                    onScroolEnd();
                }
            }}
        >
            {vods.map((v) => {
                return (
                    <div
                        className="vod-item"
                        key={v.vod_id}
                        onClick={() => {
                            setDetail(v);
                            setShowDetail(true);
                        }}
                    >
                        <img className="vod-pic" alt={v.vod_name} src={v.vod_pic} />
                        <div className="vod-info">
                            <div className="vod-name">{v.vod_name}</div>
                            <div className="vod-info-footer">
                                <span className="vod-time">{v.vod_time}</span>
                                <span
                                    className="vod-class"
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
            <div style={{ flex: "auto" }}></div>
            <Modal
                open={showDetail}
                content={
                    <div
                        style={{
                            padding: "16px",
                            backgroundColor: "var(--background)",
                            height: "100%",
                            position: "relative",
                            overflow: "auto",
                        }}
                    >
                        <h3 style={{ marginBottom: 10 }}>{detail?.vod_name}</h3>
                        <div>
                            {currentUrl ? (
                                <VidyardPlayer
                                    width={"100%"}
                                    height={"calc(100vw / 16 * 9)"}
                                    controls={true}
                                    url={currentUrl}
                                    config={{
                                        file: {
                                            forceHLS: true,
                                        },
                                    }}
                                ></VidyardPlayer>
                            ) : (
                                <img style={{ width: "100%" }} alt={detail?.vod_name} src={detail?.vod_pic} />
                            )}
                        </div>
                        <div style={{ display: "flex", flexWrap: "wrap", marginTop: 20 }}>
                            {vodUrlList.map((v) => {
                                return (
                                    <span
                                        style={{
                                            marginRight: "16px",
                                            cursor: "pointer",
                                            padding: "4px 6px",
                                            border: "1px solid #ccc",
                                            borderRadius: 5,
                                            marginBottom: 8,
                                        }}
                                        key={v.url}
                                        onClick={() => setCurrentUrl(v.url)}
                                    >
                                        {v.name}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                }
                onClose={() => setShowDetail(false)}
            ></Modal>
        </div>
    );
};
