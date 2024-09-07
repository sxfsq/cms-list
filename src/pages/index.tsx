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
    useEffect(() => {
        if (query.url) {
            setConfig({
                url: "https://proxy.eaias.com/" + (query.url as string),
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
            return axios(config.url + "?ac=detail" + "pg=" + (page || "") + "&wd=" + (wd || "") + "&t=" + (t || ""))
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
        axios(config.url + "?ac=list")
            .then((res) => res.data)
            .then((data) => {
                setTypes(data.class);
            });
        axios(config.url + "?ac=detail")
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
                            placeholder="搜索"
                        />
                        <button
                            onClick={() => {
                                getList(1, filterText, tId);
                            }}
                        >
                            搜索
                        </button>
                    </div>
                </div>
                <div
                    className="type-list"
                    onWheel={(e) => {
                        const ele = e.target as HTMLDivElement;
                        ele.scrollTo(ele.scrollTop + e.deltaY, 0);
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
            </div>
        </>
    );
}
