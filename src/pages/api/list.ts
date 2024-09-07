// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createPageResult, PageResult } from "@/model/page";
import { Type } from "@/model/type";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<PageResult<Type>>) {
    if (req.method != "GET") return res.status(405).end();
    let baseUrl = decodeURIComponent(Array.isArray(req.query.url) ? req.query.url[0] : req.query.url || "");
    baseUrl = baseUrl.split("?")[0];
    const page = Array.isArray(req.query.pg) ? req.query.pg[0] : req.query.pg || "1";
    const wd = Array.isArray(req.query.wd) ? req.query.wd[0] : req.query.wd || "";
    const t = Array.isArray(req.query.t) ? req.query.t[0] : req.query.t || "";
    const url = `${baseUrl}?ac=detail&pg=${page}&wd=${wd}&t=${t}`;
    try {
        const result = await fetch(url).then((r) => r.json());
        res.status(200).json(createPageResult(result.list, result));
    } catch (e) {
        return res.status(500).end();
    }
}
