import { init } from "ts-indexdb";
import { DbTable } from "ts-indexdb/dist/TsIndexDb";
const TABLE_NAME = "litechat";
export class IndexedDB {
  static version = 8;
  private static getTableConfig(tableName: string): DbTable {
    return {
      tableName: tableName, // 表名
      option: { keyPath: "id", autoIncrement: true }, // 指明主键为id
      indexs: [
        {
          key: "id",
          option: {
            unique: true,
          },
        },
      ],
    };
  }
  static async init() {
    await init({
      dbName: TABLE_NAME, // 数据库名称
      version: IndexedDB.version, // 版本号
      tables: [
        this.getTableConfig("favorite_vod"),
        this.getTableConfig("favorite_art"),
        this.getTableConfig("history_art"),
      ],
    });
  }
}
export type KeyValue = {
  id: string;
  data: unknown;
};