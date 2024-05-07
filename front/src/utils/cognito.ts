import {
  CognitoUserPool,
  CognitoUserSession,
  AuthenticationDetails,
  CognitoUser,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: import.meta.env.VITE_USER_POOL_ID || "",
  ClientId: import.meta.env.VITE_CLIENT_ID || "",
};

const userPool = new CognitoUserPool(poolData);

export function authenticate(
  email: string,
  password: string
): Promise<CognitoUserSession> {
  const authenticationData = {
    Username: email,
    Password: password,
  };
  const authenticationDetails = new AuthenticationDetails(authenticationData);
  const userData = {
    Username: email,
    Pool: userPool,
  };
  const cognitoUser = new CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
}

export function register(email: string, password: string) {
  return new Promise((resolve, reject) => {
    userPool.signUp(email, password, [], [], (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data?.user);
      }
    });
  });
}

export function logout() {
  const cognitoUser = userPool.getCurrentUser();
  cognitoUser?.signOut();
  return Promise.resolve();
}
