import { GeoPosition } from "geo-position.ts";
import { InvalidDataError, YandexRequestError } from "../error";
import * as request from "request";
import { parseString } from "xml2js";

type yandexResCoord = { latitude: string, longitude: string, nlatitude: string, nlongitude: string };
export class TowerInfo {
    /**
     * mobile country code
     */
    public MCC;
    /**
     * mobile network code
     */
    public MNC;
    /**
     * location area code
     */
    public LAC;
    /**
     * cell id
     */
    public CID;
    /**
     * signal strength
     */
    public RSSI;
    /**
     * geo position
     */
    public position: GeoPosition;

    public toString() {
        return `${this.MCC}/${this.MNC}/${this.LAC.toString(16).toUpperCase()}/${this.CID.toString(16).toUpperCase()}/${this.RSSI}dBm`;
    }

    public static parse(tower: string) {
        var splits = tower.split('/');
        if (splits.length != 5)
            throw new InvalidDataError("Not correct LBS string, try [MCC/MNC/LAC/CID/RSSI]");

        let a = new TowerInfo();
        a.MCC = parseInt(splits[0]);
        a.MNC = parseInt(splits[1]);
        a.LAC = parseInt(splits[2], 16);
        a.CID = parseInt(splits[3], 16);
        a.RSSI = parseFloat(splits[4].replace("dBm", ""));
        return a;
    }

    public async UpdatePosition() {
        this.position = await TowerInfo.GetTowerPositionFromYandex(this, false);
    }

    /**
     * Getting information lbs tower from yandex mobile services
     * @param towerInfo the Tower
     */
    public static async GetTowerPositionFromYandex(towerInfo: TowerInfo, trows: boolean = true) {
        var url =
            `http://mobile.maps.yandex.net/cellid_location/` +
            `?&cellid=${towerInfo.CID}` +
            `&operatorid=${towerInfo.MNC}` +
            `&countrycode=${towerInfo.MCC}` +
            `&lac=${towerInfo.LAC}`;
        var opts = {
            url: url,
            timeout: 10 * 1000
        };
        var resultRequest, parsedXmlObject;
        var coordinates: yandexResCoord;
        try {
            resultRequest = await this._request(opts);
            parsedXmlObject = await this._parseXml(resultRequest.body);
            coordinates = parsedXmlObject.location.coordinates[0].$;
            let lon = +this.RemoveExtraText(coordinates.longitude);
            let lat = +this.RemoveExtraText(coordinates.latitude);
            return new GeoPosition(lon, lat);
        }
        catch (e) {
            if (trows)
                throw new YandexRequestError("Failed find this tower in yandex service.", e,
                    {
                        url,
                        opts,
                        resultRequest,
                        parsedXmlObject,
                        coordinates
                    });
            return GeoPosition.Zero;
        }
    }
    private static async _request(otps: { url: string, timeout: number }): Promise<any> {
        return new Promise((resolver, rejector) => {
            request(otps, function (err, res, body) {
                if (err) {
                    rejector(err);
                    return;
                }
                resolver({ result: res, body });
            })
        });
    }

    private static async _parseXml(xml: string) {
        return new Promise((resolver, rejector) => {
            parseString(xml, function (err, result: any) {
                if (err)
                    rejector(err);
                else
                    resolver(result);
            });
        });
    }

    private static RemoveExtraText(value) {
        var allowedChars = "01234567890.".split('');
        return (value.split('').filter(c => allowedChars.includes(c))).join('');
    }
}