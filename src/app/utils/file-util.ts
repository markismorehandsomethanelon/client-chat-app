export class FileUtil {
    
    static getBase64FromBinary(data: string, contentType: string): string {
      return "data:" + contentType + ";base64," + data;
    }

    static getType(file: File): string {
      const fileType = file.type;

      const typeMap: { [key: string]: string[] } = {
        'AUDIO': ['audio/mpeg', 'audio/mp3'],
        'VIDEO': ['video/mp4', 'video/mpeg'],
        'IMAGE': ['image/jpeg', 'image/png', 'image/gif'],
        'document': [
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ],
        'PDF': [
          'application/pdf',
        ],
        'SHEET': [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        'PRESENTATION': [
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        ]
      };
    
      for (const type in typeMap) {
        if (typeMap[type].includes(fileType)) {
          return type;
        }
      }
    
      return 'OTHER';
    }

}