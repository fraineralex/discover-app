import { getAuth } from "firebase/auth";
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../config';

// Función para listar todos los usuarios en lotes de 1000
const listAllUsers = async (auth, nextPageToken = null) => {
  try {
    const listUsersResult = await auth.listUsers(1000, nextPageToken);
    const users = listUsersResult.users.map((userRecord) => userRecord.toJSON());

    if (listUsersResult.pageToken) {
      // Listar el siguiente lote de usuarios
      const nextPageUsers = await listAllUsers(auth, listUsersResult.pageToken);
      users.push(...nextPageUsers);
    }

    return users;
  } catch (error) {
    console.log('Error listing users:', error);
    throw error;
  }
};

// Función de entrada para listar todos los usuarios
const getAllUsers = async () => {
  try {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const allUsers = await listAllUsers(auth);
    return allUsers;
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error;
  }
};

export { getAllUsers };
