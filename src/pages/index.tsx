"use client";
import { ArtList } from "@/Components/art_list";
import { Loading } from "@/Components/loading";
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
    const getList = useCallback(
        (pg: number, wd: string, t: number) => {
            if (!config.url) return;
            if (loading) return;
            setLoading(true);
            return axios(
                "https://proxy.eaias.com/" + config.url + "?ac=detail" + "&pg=" + (pg || "") + "&wd=" + (wd || "") + "&t=" + (t || "")
            )
                .then((res) => res.data)
                .then((data) => {
                    if (pg == 1) {
                        setArts([]);
                        setVods([]);
                    }
                    setConfig((conf) => {
                        if (conf.type == "vod") setVods((v) => (page > pg ? [...data.list, ...v] : [...v, ...data.list]));
                        else setArts((v) => (page > pg ? [...data.list, ...v] : [...v, ...data.list]));
                        return conf;
                    });
                    setPage(Number(data.page));
                    setTypeId(t);
                    let q: { [k: string]: string | undefined } = {
                        wd: wd || undefined,
                        pg: undefined,
                        t: t + "" || undefined,
                        type: (query.type as string) || undefined,
                    };
                    let queryString = Object.keys(q)
                        .filter((k) => q[k])
                        .map((k) => k + "=" + q[k])
                        .join("&");
                    push("?url=" + config.url + "&" + queryString);
                })
                .finally(() =>
                    setTimeout(() => {
                        setLoading(false);
                    }, 1000)
                );
        },
        [config.url, loading, page, push, query.type]
    );

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
    }, [filterText, query.pg, query.t, query.type, query.url, query.wd]);

    useEffect(() => {
        if (!config.url) return;
        axios("https://proxy.eaias.com/" + config.url + "?ac=list")
            .then((res) => res.data)
            .then((data) => {
                setTypes(data.class);
            });
        axios("https://proxy.eaias.com/" + query.url + "?ac=detail" + "&pg=1" + "&wd=" + (query.wd || "") + "&t=" + (query.t || ""))
            .then((res) => res.data)
            .then((data) => {
                setConfig((v) => {
                    if (v.type == "vod") setVods(data.list);
                    else setArts(data.list);
                    return v;
                });
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        onKeyDown={(e) => {
                            if (e.key == "Enter") {
                                replace("/?url=" + input);
                            }
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
                <meta name="description" content="直接浏览采集站数据" />
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
                                className={"type-item " + (tId + "" == v.type_id + "" ? "activity" : "")}
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
                        onScroolTop={() => {
                            getList(1, filterText, tId);
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
                        onScroolTop={() => {
                            getList(1, filterText, tId);
                        }}
                    ></ArtList>
                )}
                <Loading loading={loading} />
            </div>
        </>
    );
}
