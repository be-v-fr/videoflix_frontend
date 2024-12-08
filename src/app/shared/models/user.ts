export class User {
    id: number;
    email: string;


    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
        this.email = obj.email ? obj.email : '';
    }

    
    toJson(): {} {
        return {
            id: this.id,
            email: this.email,
        }
    }
}