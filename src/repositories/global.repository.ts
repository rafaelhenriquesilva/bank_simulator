import { ErrorUtil } from "../utils/error.util";
import { LoggerUtil } from "../utils/logger.util";
import { RepositoryUtil } from "../utils/repository.util";
import { FindOptions, Model, QueryTypes,  } from "sequelize";

export class GlobalRepository<T extends Model> {
    private repositoryUtil: RepositoryUtil<T>;

    constructor(model: any) {
        LoggerUtil.logInfo('Starting GlobalRepository', 'repositories/global.repository.ts');
        this.repositoryUtil = new RepositoryUtil<T>(model);
    }

    async getDataByParameters(whereCondition: any, isReplica?: boolean ): Promise<T[]> {
        LoggerUtil.logInfo(`Starting getDataByParameters, whereCondition: ${
            JSON.stringify(whereCondition)
        }`, 'repositories/global.repository.ts');
        return ErrorUtil.handleErrorsIfContains(this.repositoryUtil.getRecordsByParameters(whereCondition)) as Promise<T[]>;
    }

    async updateData(data: any, whereCondition: any, isReplica?: boolean ): Promise<T> {
        data.updated_at = new Date();
        LoggerUtil.logInfo(`Starting updateData, data: ${
            JSON.stringify(data)
        }, whereCondition: ${ JSON.stringify(whereCondition) }`, 'repositories/global.repository.ts');
        return ErrorUtil.handleErrorsIfContains(this.repositoryUtil.updateRecord(data, whereCondition, isReplica)) as Promise<T>;
    }

    async createData(data: Partial<T>, isReplica?: boolean ): Promise<T> {
        LoggerUtil.logInfo(`Starting createData, data: ${
            JSON.stringify(data)
        }`, 'repositories/global.repository.ts');
        return ErrorUtil.handleErrorsIfContains(this.repositoryUtil.createRecord(data, isReplica)) as Promise<T>;
    }

    async deleteData(id: number, isReplica?: boolean ): Promise<{ message: string }> {
        LoggerUtil.logInfo(`Starting deleteData, id: ${
            JSON.stringify(id)
        }`, 'repositories/global.repository.ts');
        return ErrorUtil.handleErrorsIfContains(this.repositoryUtil.deleteRecord(id, isReplica)) as Promise<{ message: string }>;
    }

    async executeQuery(query: string, typeQuery: QueryTypes,isReplica?: boolean ): Promise<any> {
        LoggerUtil.logInfo(`Starting executeQuery, query: ${
            JSON.stringify(query)
        }`, 'repositories/global.repository.ts');
        return ErrorUtil.handleErrorsIfContains(this.repositoryUtil.executeQuery(query, typeQuery, isReplica )) as Promise<any>;
    }
}