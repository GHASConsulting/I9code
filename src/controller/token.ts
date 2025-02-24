import { TokenManager } from "../middlewares/token";

export async function getToken() : Promise<string> { 
  const tokenManager = new TokenManager();
  const token = tokenManager.getToken().then(token => {
    console.log('Token atual:', token);
    return token;
  });
  return token;
}
