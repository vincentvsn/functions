"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const currencyCloud = __importStar(require("currency-cloud"));
const loginId = 'tech@keewe.eu';
const apiKey = '8f6568f36d852eb44e876fa82935429a9666393b4a1a4bf3af6e91b761d42b31';
const conversionId = 'd9b16e34-463d-4d7d-b89e-15f8ea010c0f';
currencyCloud.authentication.login({
    environment: 'demo',
    loginId: loginId,
    apiKey: apiKey
})
    .then(() => {
    return currencyCloud.conversions.find();
})
    .then((res) => {
    const conversion = res.conversions.find((conv) => {
        return conv.id === conversionId;
    });
    if (conversion) {
        console.log('Conversion details: ' + JSON.stringify(conversion, null, 2));
    }
    else {
        console.log('Conversion not found.');
    }
})
    .then(currencyCloud.authentication.logout)
    .catch(console.log);
//# sourceMappingURL=test.js.map