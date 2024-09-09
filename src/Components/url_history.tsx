import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const addHistory = (url: string, name: string) => {
    let his = localStorage.getItem("url_historys");
    let hisList: { url: string; name: string }[] = [];
    try {
        hisList = his ? JSON.parse(his) : [];
    } catch (error) {}
    hisList = hisList.filter((item) => item.url !== url);
    hisList.push({ url, name });
    if (hisList.length > 10) hisList.shift();
    localStorage.setItem("url_historys", JSON.stringify(hisList));
};

export const delHistory = (url: string) => {
    let his = localStorage.getItem("url_historys");
    let hisList: { url: string; name: string }[] = [];
    try {
        hisList = his ? JSON.parse(his) : [];
    } catch (error) {}
    hisList = hisList.filter((item) => item.url !== url);
    localStorage.setItem("url_historys", JSON.stringify(hisList));
};

export const UrlHistory = () => {
    const { push } = useRouter();
    const [history, setHistory] = useState<{ url: string; name: string }[]>([]);
    useEffect(() => {
        let his = localStorage.getItem("url_historys");
        let hisList: { url: string; name: string }[] = [];
        try {
            hisList = his ? JSON.parse(his) : [];
        } catch (error) {}
        setHistory(hisList);
    }, []);
    return (
        <>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 5,
                    margin: "10px auto",
                    width: "min(700px,90vw)",
                    flexWrap: "wrap",
                    justifyContent: "flex-start",
                }}
            >
                {history.map((v) => (
                    <div
                        key={v.url}
                        style={{ cursor: "pointer", padding: 5, borderRadius: 4, lineHeight: "25px", display: "flex" }}
                        onClick={() => push("/?url=" + v.url)}
                    >
                        {v.name}
                        <span
                            style={{ marginLeft: 16, display: "flex", alignItems: "center" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                delHistory(v.url);
                                setHistory(history.filter((v2) => v2.url !== v.url));
                            }}
                        >
                            <svg
                                viewBox="0 0 1024 1024"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                p-id="4246"
                                width="20"
                                height="20"
                            >
                                <path
                                    d="M509.262713 5.474574c281.272162 0 509.262713 228.02238 509.262713 509.262713 0 281.272162-227.990551 509.262713-509.262713 509.262713s-509.262713-227.990551-509.262713-509.262713c0-281.240333 227.990551-509.262713 509.262713-509.262713z m135.050106 278.725849L509.262713 419.250528l-135.050106-135.050105-90.012184 90.012184L419.186871 509.262713l-135.018277 135.081935 90.012184 90.012184L509.262713 599.274897l135.050106 135.050106 90.012184-90.012184L599.274897 509.262713l135.050106-135.050106-90.012184-90.012184z"
                                    fill="#4B4B4B"
                                    p-id="4247"
                                ></path>
                            </svg>
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
};
