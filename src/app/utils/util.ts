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

    

    static fileToBase64(file: File): Promise<string> {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          // Reading succeeded
          const base64String = e.target.result.toString();
          resolve(base64String); // remove data url prefix
        };
        reader.onerror = (error) => {
          // Reading failed
          reject(error);
        };
      });
    }

}