/**
 * Represents a user.
 */
export class User {
    id: number;


    constructor(obj: any) {
        this.id = obj.id ? obj.id : -1;
    }
}