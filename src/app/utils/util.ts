export class Util {
    
    static arrayBufferToBase64(arrayBuffer: ArrayBuffer): string {
        const binary = new Uint8Array(arrayBuffer);
        let base64String = '';
        binary.forEach((byte) => {
          base64String += String.fromCharCode(byte);
        });
        return btoa(base64String);
    }

    static byteArrayToBase64(byteArray: Uint8Array): string {
        let binaryString = String.fromCharCode(...byteArray);
        // Convert string to 
        return btoa(binaryString);
    }

  }