import test from "ava";
import { TowerInfo } from "./../src";
import { GeoPosition } from "geo-position.ts";

test("Getting from Yandex", async (t) => {
    t.plan(2);
    let result = await TowerInfo.GetTowerPositionFromYandex(TowerInfo.parse("250/1/19E/DC6/-76dBm"));
    t.deepEqual(result, new GeoPosition(37.6929398, 55.814621))
    await t.throwsAsync(async () => {
        await TowerInfo.GetTowerPositionFromYandex(TowerInfo.parse("999/999/19E/DC6/-76dBm"));
    }, "Failed find this tower in yandex service.")
});

test("Parse", async (t) => {
    t.plan(2);
    let res = new TowerInfo();
    res.CID = 3526;
    res.LAC = 414;
    res.MCC = 250;
    res.MNC = 1;
    res.RSSI = -76;
    t.deepEqual(TowerInfo.parse("250/1/19E/DC6/-76dBm"), res);

    t.throws(() => {
        TowerInfo.parse("250/19E/DC6/-76dBm")
    }, "Not correct LBS string, try [MCC/MNC/LAC/CID/RSSI]");
});
test("UpdatePosition", async (t) => {
    let res = new TowerInfo();
    res.CID = 3526;
    res.LAC = 414;
    res.MCC = 250;
    res.MNC = 1;
    res.RSSI = -76;
    await res.UpdatePosition();
    t.deepEqual(res.position, new GeoPosition(37.6929398, 55.814621))
});
test("toString", async (t) => {
    let res = new TowerInfo();
    res.CID = 3526;
    res.LAC = 414;
    res.MCC = 250;
    res.MNC = 1;
    res.RSSI = -76;
    t.deepEqual(res.toString(), "250/1/19E/DC6/-76dBm");
});