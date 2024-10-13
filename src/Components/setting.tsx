import { useEffect, useState } from "react";
import { Tcon_setting } from "./svg_icons";

export const Setting = ({ onChange }: { onChange: (option: { proxyUrl: string }) => void }) => {
    const [proxyUrl, setProxyUrl] = useState("");
    const [show, setShow] = useState(false);

    useEffect(() => {
        let url = localStorage.getItem("setting_proxyUrl");
        setProxyUrl(url || "");
    }, []);

    return (
        <>
            <span
                onClick={() => setShow(!show)}
                style={{ cursor: "pointer", position: "absolute", right: 10, top: 10, fontSize: 20, color: "white" }}
            >
                <Tcon_setting />
            </span>
            {show && (
                <div
                    style={{
                        position: "absolute",
                        left: 0,
                        top: 60,
                        width: "100%",
                        padding: 0,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <input
                        type="text"
                        style={{
                            maxWidth: 400,
                            borderRadius: "5px",
                        }}
                        placeholder="请输入代理地址"
                        value={proxyUrl}
                        onChange={(e) => {
                            setProxyUrl(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key == "Enter") {
                                localStorage.setItem("setting_proxyUrl", proxyUrl);
                                setShow(false);
                                onChange({ proxyUrl: proxyUrl });
                            }
                        }}
                    />
                </div>
            )}
        </>
    );
};
