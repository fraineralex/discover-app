import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('discover-app.db');

// Función para crear la tabla "places" si no existe
const createPlacesTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS places (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_uuid TEXT NOT NULL,
        formatted_address TEXT NOT NULL,
        lat REAL,
        lng REAL,
        icon TEXT,
        name TEXT,
        open_now INTEGER,
        photo_reference TEXT,
        rating REAL,
        place_id TEXT,
        price_level INTEGER,
        reference TEXT,
        user_ratings_total INTEGER,
        business_status TEXT,
        icon_background_color TEXT,
        icon_mask_base_uri TEXT,
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
const getPlacesByUserId = (userUuid, callback) => {
  db.transaction(tx => {
    tx.executeSql(
      `SELECT * FROM places WHERE user_uuid = ?;`,
      [userUuid],
      (_, { rows }) => {
        const places = rows._array;
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
      `INSERT INTO places (user_uuid, formatted_address, lat, lng, icon, name, open_now, photo_reference, rating, place_id, price_level, reference, user_ratings_total, business_status, icon_background_color, icon_mask_base_uri)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
      [userUuid, place.formatted_address, place.geometry.location.lat, place.geometry.location.lng, place.icon, place.name, place.opening_hours.open_now ? 1 : 0, place.photos[0].photo_reference, place.rating, place.place_id, place.price_level, place.reference, place.user_ratings_total, place.business_status, place.icon_background_color, place.icon_mask_base_uri],
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
