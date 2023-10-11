//UPDATE user_authentication SET token = '${token}' WHERE id = ${userResult[0].id}

export const UserAuthenticationQueries ={
    updateUserToken: (token: string, id: number) => {
        return `UPDATE user_authentication SET token = '${token}' WHERE id = ${id}`;
    }
}