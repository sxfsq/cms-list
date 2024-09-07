"use client";
import { ArtList } from "@/Components/art_list";
import { VideoList } from "@/Components/video_list";
import { Art } from "@/model/art";
import { Type } from "@/model/type";
import { Video } from "@/model/video";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function Home() {
    const { query, push, replace } = useRouter();
    const [types, setTypes] = useState<Type[]>([]);
    const [vods, setVods] = useState<Video[]>([]);
    const [arts, setArts] = useState<Art[]>([]);
    const [page, setPage] = useState(1);
    const [input, setInput] = useState<string>("");
    const [config, setConfig] = useState<{ url?: string; type: "vod" | "art" }>({
        type: "vod",
        url: "",
    });
    const [tId, setTypeId] = useState(0);
    const [loading, setLoading] = useState(false);
    const [filterText, setFilterText] = useState("");
    const [scroolLeft, setScroolLeft] = useState(0);
    useEffect(() => {
        if (query.url) {
            setConfig({
                url: (query.url as string).split("?")[0],
                type: query.type ? (query.type as "art" | "vod") : query.url.includes("/art") ? "art" : "vod",
            });
        }
        if (query.t) {
            setTypeId(Number(query.t));
        }
        if (query.wd) {
            setFilterText(query.wd as string);
        }
        if (query.pg) {
            setPage(Number(query.pg));
        }
    }, [query.pg, query.t, query.type, query.url, query.wd]);
    const getList = useCallback(
        (page: number, wd: string, t: number) => {
            if (!config.url) return;
            if (loading) return;
            setLoading(true);
            return axios(
                "https://proxy.eaias.com/" + config.url + "?ac=detail" + "&pg=" + (page || "") + "&wd=" + (wd || "") + "&t=" + (t || "")
            )
                .then((res) => res.data)
                .then((data) => {
                    if (page == 1) {
                        setArts([]);
                        setVods([]);
                    }
                    setConfig((v) => {
                        if (v.type == "vod") setVods((v) => [...v, ...data.list]);
                        else setArts((v) => [...v, ...data.list]);
                        return v;
                    });
                    setPage(Number(data.page));
                    setTypeId(t);
                    push("?url=" + config.url + "&type=" + config.type + "&wd=" + wd + "&t=" + t);
                })
                .finally(() => setLoading(false));
        },
        [config.type, config.url, loading, push]
    );

    useEffect(() => {
        if (!config.url) return;
        axios("https://proxy.eaias.com/" + config.url + "?ac=list")
            .then((res) => res.data)
            .then((data) => {
                setTypes(data.class);
            });
        axios("https://proxy.eaias.com/" + config.url + "?ac=detail")
            .then((res) => res.data)
            .then((data) => {
                setConfig((v) => {
                    if (v.type == "vod") setVods(data.list);
                    else setArts(data.list);
                    return v;
                });
                setPage(data.page);
                setTypeId(0);
            });
    }, [config.url]);
    if (!config.url) {
        return (
            <div className="init-wrap">
                <div>
                    <input
                        type="text"
                        placeholder="请输入采集地址"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                        }}
                    />
                    <button
                        onClick={() => {
                            replace("/?url=" + input + "&type=vod");
                        }}
                    >
                        视频
                    </button>
                    <button
                        onClick={() => {
                            replace("/?url=" + input + "&type=art");
                        }}
                    >
                        图文
                    </button>
                </div>
            </div>
        );
    }
    return (
        <>
            <Head>
                <title>CMS Ls</title>
                <meta name="description" content="采集站数据展示网站" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div style={{ display: "flex", flexDirection: "column", height: "100vbh" }}>
                <div className="header">
                    <div className="logo"></div>
                    <div className="search">
                        <input
                            type="text"
                            value={filterText}
                            onChange={(e) => {
                                setFilterText(e.target.value);
                            }}
                            onKeyUp={(e) => {
                                if (e.key == "Enter") {
                                    getList(1, filterText, tId);
                                }
                            }}
                            placeholder="关键字"
                        />
                        <button
                            onClick={() => {
                                getList(1, filterText, tId);
                            }}
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="1836"
                                width={"1em"}
                                height={"1em"}
                            >
                                <path
                                    d="M467.92892 935.905986a467.92892 467.92892 0 1 1 331.010811-136.918108 466.424325 466.424325 0 0 1-331.010811 136.918108zM467.92892 150.507607a317.46946 317.46946 0 1 0 225.689189 93.284865 315.964865 315.964865 0 0 0-225.689189-93.284865zM771.556109 922.515094l151.587906-151.587905 101.033527 101.108757-151.587905 151.587905z"
                                    fill="#272536"
                                    p-id="1837"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <div
                    className="type-list"
                    onWheel={(e) => {
                        let ele = e.target as HTMLDivElement;
                        if (!ele.classList.contains("type-list")) {
                            ele = document.getElementsByClassName("type-list")[0] as HTMLDivElement;
                        }
                        setScroolLeft((v) => {
                            ele.scrollTo(v + e.deltaY, 0);
                            if (v + e.deltaY < 0) return 0;
                            if (v + e.deltaY > ele.offsetWidth) return ele.offsetWidth;
                            return v + e.deltaY;
                        });
                    }}
                >
                    {types.map((v) => {
                        return (
                            <span
                                className={"type-item " + (tId == v.type_id ? "activity" : "")}
                                key={v.type_id}
                                onClick={() => {
                                    getList(1, filterText, tId == v.type_id ? 0 : v.type_id);
                                }}
                            >
                                {v.type_name}
                            </span>
                        );
                    })}
                </div>
                {config.type == "vod" ? (
                    <VideoList
                        vods={vods}
                        onScroolEnd={() => {
                            getList(page + 1, filterText, tId);
                        }}
                        onType={(tid) => {
                            getList(1, filterText, tid);
                        }}
                    ></VideoList>
                ) : (
                    <ArtList
                        arts={arts}
                        onScroolEnd={() => {
                            getList(page + 1, filterText, tId);
                        }}
                        onType={(tid) => {
                            getList(1, filterText, tid);
                        }}
                    ></ArtList>
                )}
                {loading && (
                    <div className="loading">
                        <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3795" width="32" height="32">
                            <path
                                d="M876.864 782.592c3.264 0 6.272-3.2 6.272-6.656 0-3.456-3.008-6.592-6.272-6.592-3.264 0-6.272 3.2-6.272 6.592 0 3.456 3.008 6.656 6.272 6.656z m-140.544 153.344c2.304 2.432 5.568 3.84 8.768 3.84a12.16 12.16 0 0 0 8.832-3.84 13.76 13.76 0 0 0 0-18.56 12.224 12.224 0 0 0-8.832-3.84 12.16 12.16 0 0 0-8.768 3.84 13.696 13.696 0 0 0 0 18.56zM552.32 1018.24c3.456 3.648 8.32 5.76 13.184 5.76a18.368 18.368 0 0 0 13.184-5.76 20.608 20.608 0 0 0 0-27.968 18.368 18.368 0 0 0-13.184-5.824 18.368 18.368 0 0 0-13.184 5.76 20.608 20.608 0 0 0 0 28.032z m-198.336-5.76c4.608 4.8 11.072 7.68 17.6 7.68a24.448 24.448 0 0 0 17.536-7.68 27.456 27.456 0 0 0 0-37.248 24.448 24.448 0 0 0-17.536-7.68 24.448 24.448 0 0 0-17.6 7.68 27.52 27.52 0 0 0 0 37.184z m-175.68-91.84c5.76 6.08 13.824 9.6 21.952 9.6a30.592 30.592 0 0 0 22.016-9.6 34.368 34.368 0 0 0 0-46.592 30.592 30.592 0 0 0-22.016-9.6 30.592 30.592 0 0 0-21.952 9.6 34.368 34.368 0 0 0 0 46.592z m-121.152-159.36c6.912 7.36 16.64 11.648 26.368 11.648a36.736 36.736 0 0 0 26.432-11.584 41.28 41.28 0 0 0 0-55.936 36.736 36.736 0 0 0-26.432-11.584 36.8 36.8 0 0 0-26.368 11.52 41.28 41.28 0 0 0 0 56zM12.736 564.672a42.88 42.88 0 0 0 30.784 13.44 42.88 42.88 0 0 0 30.784-13.44 48.128 48.128 0 0 0 0-65.216 42.88 42.88 0 0 0-30.72-13.44 42.88 42.88 0 0 0-30.848 13.44 48.128 48.128 0 0 0 0 65.216z m39.808-195.392a48.96 48.96 0 0 0 35.2 15.36 48.96 48.96 0 0 0 35.2-15.36 54.976 54.976 0 0 0 0-74.56 48.96 48.96 0 0 0-35.2-15.424 48.96 48.96 0 0 0-35.2 15.424 54.976 54.976 0 0 0 0 74.56zM168.32 212.48c10.368 11.008 24.96 17.408 39.68 17.408 14.592 0 29.184-6.4 39.552-17.408a61.888 61.888 0 0 0 0-83.84 55.104 55.104 0 0 0-39.616-17.408c-14.656 0-29.248 6.4-39.616 17.408a61.888 61.888 0 0 0 0 83.84zM337.344 124.8c11.52 12.16 27.712 19.264 43.968 19.264 16.256 0 32.448-7.04 43.968-19.264a68.672 68.672 0 0 0 0-93.184 61.248 61.248 0 0 0-43.968-19.264 61.248 61.248 0 0 0-43.968 19.264 68.736 68.736 0 0 0 0 93.184z m189.632-1.088c12.672 13.44 30.528 21.248 48.448 21.248s35.712-7.808 48.384-21.248a75.584 75.584 0 0 0 0-102.464A67.392 67.392 0 0 0 575.36 0c-17.92 0-35.776 7.808-48.448 21.248a75.584 75.584 0 0 0 0 102.464z m173.824 86.592c13.824 14.592 33.28 23.104 52.736 23.104 19.584 0 39.04-8.512 52.8-23.104a82.432 82.432 0 0 0 0-111.744 73.472 73.472 0 0 0-52.8-23.168c-19.52 0-38.912 8.512-52.736 23.168a82.432 82.432 0 0 0 0 111.744z m124.032 158.528c14.976 15.872 36.032 25.088 57.216 25.088 21.12 0 42.24-9.216 57.152-25.088a89.344 89.344 0 0 0 0-121.088 79.616 79.616 0 0 0-57.152-25.088c-21.184 0-42.24 9.216-57.216 25.088a89.344 89.344 0 0 0 0 121.088z m50.432 204.032c16.128 17.088 38.784 27.008 61.632 27.008 22.784 0 45.44-9.92 61.568-27.008a96.256 96.256 0 0 0 0-130.432 85.76 85.76 0 0 0-61.568-27.072c-22.848 0-45.44 9.984-61.632 27.072a96.192 96.192 0 0 0 0 130.432z"
                                fill="#d4237a"
                                p-id="3796"
                            ></path>
                        </svg>
                    </div>
                )}
            </div>
        </>
    );
}
