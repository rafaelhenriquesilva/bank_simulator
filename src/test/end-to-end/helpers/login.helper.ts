export const loginUser = (request: any, username: string, password: string) => {
  return request.post('/login')
    .send({
      "username": username,
      "password": password
    })
    .set('Content-Type', 'application/json'); // Set the content-type header
}