import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('discover-app.db');

// Función para crear la tabla "users" si no existe
const createUsersTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        display_name TEXT,
        email TEXT UNIQUE,
        photo_url TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => console.log('Users table created or already exists'),
      (_, error) => {
        console.error('Error creating users table:', error);
      }
    );
  });
};

// Función para guardar un usuario en la tabla "users"
const saveUser = (user, callback) => {
  const { displayName, email, photoUrl } = user;

  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO users (display_name, email, photo_url)
        VALUES (?, ?, ?);`,
      [displayName, email, photoUrl],
      (_, { insertId }) => {
        console.log('User saved with ID:', insertId);
        callback(insertId);
      },
      (_, error) => {
        console.error('Error saving user:', error);
        callback(null);
      }
    );
  });
};

// Función para obtener todos los usuarios
const getAllUsers = (callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM users;`,
      [],
      (_, { rows }) => {
        const users = rows._array.map(user => ({
          ...user
        }));
        callback(users);
      },
      (_, error) => {
        console.error('Error fetching users:', error);
        callback([]);
      }
    );
  });
};

createUsersTable();

export { createUsersTable, saveUser, getAllUsers };
