import { Video } from "@/model/video";
import { useEffect, useState } from "react";
import VidyardPlayer from "react-player";

export function Player({ detail }: { detail?: Video }) {
    const [currentUrl, setCurrentUrl] = useState("");
    const [vodUrlList, setVodUrlList] = useState<{ name: string; url: string }[]>([]);
    useEffect(() => {
        const urlList = detail?.vod_play_url?.split("#") || [];
        setVodUrlList((vodList) => {
            vodList.length = 0;
            urlList.forEach((v) => {
                vodList.push({ name: v.split("$")[0], url: v.split("$")[1] });
            });
            const url = vodList[0]?.url || "";
            setCurrentUrl(url);
            return [...vodList];
        });
    }, [detail?.vod_play_url]);
    return (
        <div>
            <div
                style={{
                    padding: 12,
                    backgroundColor: "var(--background)",
                    height: "100%",
                    position: "relative",
                    overflow: "auto",
                }}
            >
                <h3 style={{ marginBottom: 10 }}>{detail?.vod_name}</h3>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {currentUrl ? (
                        <VidyardPlayer
                            width={"calc((100vh - 56px) / 9 * 16)"}
                            height={"min(100vdh - 50px,calc(100vw / 16 * 9))"}
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
        </div>
    );
}
