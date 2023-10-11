import { QueryTypes } from "sequelize";

export enum ValidMethods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    QUERY = 'QUERY',
}

export class RepositoryDTO {
    public query: string = '';
    public whereCondition : any;
    public entity  : any;
    public connection  : any;
    public data  : any;
    public id: any;
    public method: ValidMethods;
    public callback: any;
    public isReplicaDatabase: boolean = true;
    public queryType: QueryTypes = QueryTypes.SELECT;

    constructor(method: ValidMethods) {
        if (!Object.values(ValidMethods).includes(method)) {
            throw new Error(`Invalid method: ${method}`);
        }
        this.method = method;
    }
  }
   