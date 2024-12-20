export interface Permission {
  Customers: {
    acccess: boolean;
  };
}

interface DecodedToken {
  email: string;
  exp: number;
  iat: number;
  permission: string;
  user_id: number;
}
export  function extractPermissions(decodedToken: DecodedToken | null) {
  if (!decodedToken) {
    return null; // Early return if the token is null
  }

  try {
    let permissions: Permission;

    // Check if permission is a valid string and parse it
    if (typeof decodedToken.permission === 'string') {
      permissions = JSON.parse(decodedToken.permission);
    } else {
      permissions = decodedToken.permission;
    }

    return permissions;
  } catch (error) {
    console.error('Error parsing permission:', error);
    return null;
  }
}

