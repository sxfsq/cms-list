// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createPageResult, PageResult } from "@/model/page";
import { Type } from "@/model/type";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse<PageResult<Type>>) {
    if (req.method != "GET") return res.status(405).end();
    const baseUrl = decodeURIComponent(Array.isArray(req.query.url) ? req.query.url[0] : req.query.url || "");
    // const page = Array.isArray(req.query.pg) ? req.query.pg[0] : req.query.pg || "1";
    // const wd = Array.isArray(req.query.wd) ? req.query.wd[0] : req.query.wd || "";
    try {
        const result = await fetch(`${baseUrl}?ac=list`).then((r) => r.json());

        res.status(200).json(createPageResult(result.class, result));
    } catch (error) {
        res.status(500).end();
    }
}
