export class User {
    id: number;


    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
    }

    
    toJson(): {} {
        return {
            id: this.id,
        }
    }
}