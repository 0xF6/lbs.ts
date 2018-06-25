import test from "ava";
import { TowerInfo } from "./../src";
import { GeoPosition } from "geo-position.ts";

test("Getting from Yandex", async (t) => {
    let result = await TowerInfo.GetTowerPositionFromYandex(TowerInfo.parse("250/1/19E/DC6/-76dBm"));
    t.deepEqual(result, new GeoPosition(37.6919327, 55.8146706))
});

test("Parse", async (t) => {
    let res = new TowerInfo();
    res.CID = 3526;
    res.LAC = 414;
    res.MCC = 250;
    res.MNC = 1;
    res.RSSI = -76;
    t.deepEqual(TowerInfo.parse("250/1/19E/DC6/-76dBm"), res);
});
test("UpdatePosition", async (t) => {
    let res = new TowerInfo();
    res.CID = 3526;
    res.LAC = 414;
    res.MCC = 250;
    res.MNC = 1;
    res.RSSI = -76;
    await res.UpdatePosition();
    t.deepEqual(res.position, new GeoPosition(37.6919327, 55.8146706))
});