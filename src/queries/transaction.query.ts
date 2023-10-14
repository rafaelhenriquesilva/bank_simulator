export default class TransactionQuery {
    static getTransactions(complementQuery?: string) {
        let query = 'SELECT ' +
        '`transaction`.number_account_origin transactionAccountOrigin,' +
        'accountOrigin.`type` accountOriginType,' +
        '`transaction`.number_account_destiny transactionAccountDestiny,' +
        'accountdestiny.`type` accountDestinyType,' +
        '`transaction`.value transactionValue,' +
        '`transaction`.`type` transactionType,' +
        '`transaction`.created_at ' +
        'FROM `transaction` ' +
        'LEFT join bank_account accountOrigin on accountOrigin.number_account = `transaction`.number_account_origin ' +
        'left join bank_account accountDestiny on accountDestiny.number_account = `transaction`.number_account_destiny ';

        if(complementQuery){
            query += complementQuery;
        }

        query+= ' order by `transaction`.created_at Desc';

        return query;
       
    }
}