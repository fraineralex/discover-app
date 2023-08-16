import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('discover-app.db');

// Función para crear la tabla "places" si no existe
const createPlacesTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_uuid TEXT NOT NULL,
        business_status TEXT,
        formatted_address TEXT NOT NULL,
        geometry TEXT UNIQUE,
        icon TEXT,
        icon_background_color TEXT,
        icon_mask_base_uri TEXT,
        name TEXT,
        opening_hours TEXT,
        photos TEXT,
        place_id TEXT UNIQUE,
        plus_code TEXT,
        rating REAL,
        types TEXT,
        reference TEXT UNIQUE,
        user_ratings_total INTEGER,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );`,
      [],
      () => console.log('Table created'),
      (_, error) => {
        if (error) {
          console.error('Error creating places table:', error);
        } else {
          console.log('Places table created or already exists');
        }
      }
    );
  });
};

// Función para obtener todos los registros de la tabla "places" con un ID específico
// Función para obtener todos los registros de la tabla "places" con un ID específico
const getPlacesByUserId = (userUuid, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM places WHERE user_uuid = ?;`,
      [userUuid],
      (_, { rows }) => {
        const places = rows._array.map(place => ({
          ...place,
          business_status: JSON.parse(place.business_status),
          geometry: JSON.parse(place.geometry),
          opening_hours: JSON.parse(place.opening_hours),
          photos: JSON.parse(place.photos),
          plus_code: JSON.parse(place.plus_code),
          types: JSON.parse(place.types)
        }));
        callback(places);
      },
      (_, error) => {
        console.error('Error fetching places:', error);
        callback([]);
      }
    );
  });
};


// Función para guardar un lugar (place) en la tabla "places"
const savePlace = (place, userUuid, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `INSERT INTO places (user_uuid, business_status, formatted_address, geometry, icon, icon_background_color, icon_mask_base_uri, name, opening_hours, photos, place_id, plus_code, rating, types, reference, user_ratings_total)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [
        userUuid,
        JSON.stringify(place.business_status),
        place?.formatted_address || '',
        JSON.stringify(place.geometry),
        place.icon,
        place.icon_background_color,
        place.icon_mask_base_uri,
        place.name,
        JSON.stringify(place.opening_hours),
        JSON.stringify(place.photos),
        place.place_id,
        JSON.stringify(place.plus_code),
        place.rating,
        JSON.stringify(place.types),
        place.reference,
        place.user_ratings_total
      ],
      (_, { insertId }) => {
        console.log('Place saved with ID:', insertId);
        callback(insertId);
      },
      (_, error) => {
        console.error('Error saving place:', error);
        callback(null);
      }
    );
  });
};

// Función para eliminar un lugar por su ID
const deletePlaceById = (placeId, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `DELETE FROM places WHERE id = ?;`,
      [placeId],
      (_, { rowsAffected }) => {
        if (rowsAffected > 0) {
          console.log('Place deleted successfully');
          callback(true);
        } else {
          console.error('Place not found');
          callback(false);
        }
      },
      (_, error) => {
        console.error('Error deleting place:', error);
        callback(false);
      }
    );
  });
};

createPlacesTable()


export { createPlacesTable, getPlacesByUserId, savePlace, deletePlaceById };
