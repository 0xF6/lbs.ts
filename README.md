# lbs.ts
Library for working with LBS 🌎 towers for TypeScript 🛰

[![Build Status](https://travis-ci.org/0xF6/lbs.ts.svg?branch=master)](https://travis-ci.org/0xF6/lbs.ts)
[![Maintainability](https://api.codeclimate.com/v1/badges/797e9f03227c55229723/maintainability)](https://codeclimate.com/github/0xF6/lbs.ts/maintainability)
[![Dependencies](https://img.shields.io/david/0xF6/lbs.ts.svg)](https://david-dm.org/0xF6/lbs.ts)
[![MIT license](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![codecov](https://codecov.io/gh/0xF6/lbs.ts/branch/master/graph/badge.svg)](https://codecov.io/gh/0xF6/lbs.ts)
![npm](https://img.shields.io/npm/dt/lbs.ts.svg)
        
### Install

`yarn add lbs.ts`


#### Run test

`yarn test` or `yarn test-nya` and for reports `yarn report-test`
  
![image](https://user-images.githubusercontent.com/13326808/41826086-82ff4d58-782f-11e8-91e2-58b02b2c9e2a.png)


### Usage


#### Get Geo Position (GPS) for LBS Tower
```TypeScript
let lbs_str = "250/1/19E/DC6/-76dBm";
let lbs = TowerInfo.parse(lbs);

lbs // { CID: 3526, LAC: 414, MCC: 250, MNC: 1, RSSI: -76 }

await lbs.UpdatePosition()

lbs // 
{ 
  CID: 3526, 
  LAC: 414, 
  MCC: 250, 
  MNC: 1, 
  RSSI: -76, 
  position: GeoPosition { Longitude: 55.8146706, Latitude: 37.6919327 } 
}

```
