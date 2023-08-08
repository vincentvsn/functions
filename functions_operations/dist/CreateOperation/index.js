"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const apiKey = 'pat-eu1-7b7968a5-d9f4-4960-8113-496d0a78624f';
const objectName = '2-116564448';
const activityFunction = function (context) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = context.bindings.name.data;
        yield CreateOperation(data);
    });
};
function CreateOperation(data) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        console.log(data);
        try {
            const apiUrl = 'https://api.hubapi.com';
            const endpoint = `/crm/v3/objects/${objectName}`;
            const config = {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
            };
            const response = yield axios_1.default.post(`${apiUrl}${endpoint}`, data, config);
            console.log('Custom object record created successfully:', response.data);
        }
        catch (error) {
            console.error('Error creating custom object record:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        }
    });
}
exports.default = activityFunction;
//# sourceMappingURL=index.js.map