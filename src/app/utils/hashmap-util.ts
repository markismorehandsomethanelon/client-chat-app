export class HashMapUtil {
    static getAsArray(map: Map<any, any>): any[] {
        return Array.from(map.values());
    }
}