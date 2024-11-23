import {RawAxiosRequestConfig} from "axios";


export class RequestUtil {
    private constructor() {}

    public static getDefaultRequestConfig(token: string | null): RawAxiosRequestConfig {
        return {
            headers: {
                Authorization : "Bearer " + token
            }
        }
    }

}