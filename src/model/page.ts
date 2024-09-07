export type PageResult<T = null> = {
    code: 1 | 0;
    msg?: string;
    page: number;
    pagecount: number;
    limit?: "20";
    total: number;
    list: T[];
};

export function createPageResult<T>(data: T[], page: PageResult): PageResult<T> {
    return {
        code: page.code,
        msg: page.msg,
        page: page.page,
        pagecount: page.pagecount,
        limit: page.limit,
        total: page.total,
        list: data,
    };
}
