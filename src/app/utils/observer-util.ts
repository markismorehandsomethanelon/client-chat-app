import { Subject } from "rxjs";

export class ObserverUtil {
    
    static notifyObservers(subject: Subject<any>, data: any): void {
        subject.next(data);
    }

}