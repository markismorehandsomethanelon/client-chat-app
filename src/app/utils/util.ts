export class Util {
    
    static getBase64FromBinary(data: string, contentType: string): string {
      return "data:" + contentType + ";base64," + data;
    }

}