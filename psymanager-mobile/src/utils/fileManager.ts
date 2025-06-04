import * as FileSystem from "expo-file-system";
import { storage } from "./storage";
import type { Exercise } from "../types/exercise";

// Carpeta local donde guardaremos los audios.
// e.g. "/data/user/0/your.app/files/ejercicios/" en Android,
//     o una ruta similar en iOS.
const EXERCISES_DIR = FileSystem.documentDirectory + "ejercicios/";

// Clave en SecureStore donde guardaremos el JSON de descargas
const DOWNLOAD_STORAGE_KEY = "downloadedExercises";

/**
 * Asegura que exista la carpeta EXERCISES_DIR. Si no existe, la crea.
 */
async function ensureExercisesDirExists(): Promise<void> {
  // Verificar si la carpeta ya existe
  const info = await FileSystem.getInfoAsync(EXERCISES_DIR);
  if (!info.exists) {
    // Si no existe, crearla
    await FileSystem.makeDirectoryAsync(EXERCISES_DIR, { intermediates: true });
  }
}

/**
 * Lee de SecureStore (o localStorage en web) el mapa actual de descargas.
 * El mapa tiene la forma: { [exerciseId]: localUri }
 * Si no existe nada guardado, devuelve un objeto vacío.
 */
export async function getDownloadedMap(): Promise<Record<number, string>> {
  try {
    const json = await storage.getItem(DOWNLOAD_STORAGE_KEY);
    if (!json) return {};
    const parsed: Record<number, string> = JSON.parse(json);
    return parsed;
  } catch (error) {
    console.error("Error leyendo mapa de descargas:", error);
    return {};
  }
}

/**
 * Guarda el mapa de descargas en SecureStore como JSON.
 * @param map Objeto donde cada key es el exercise.id y el value es el localUri.
 */
export async function saveDownloadedMap(
  map: Record<number, string>
): Promise<void> {
  try {
    const json = JSON.stringify(map);
    await storage.setItem(DOWNLOAD_STORAGE_KEY, json);
  } catch (error) {
    console.error("Error guardando mapa de descargas:", error);
  }
}

/**
 * Descarga el audio de un ejercicio a la carpeta local y actualiza el mapa.
 * @param ex El ejercicio a descargar. Debe contener ex.id y ex.audioUrl.
 * @returns La URI local del archivo descargado.
 * @throws Si la descarga falla o no hay ruta válida.
 */
export async function downloadExercise(ex: Exercise): Promise<string> {
  try {
    // 1. Asegurar que la carpeta exista
    await ensureExercisesDirExists();

    // 2. Generar la URI local (por ejemplo: ".../ejercicios/123.mp3")
    const filename = `${ex.id}.mp3`;
    const localUri = EXERCISES_DIR + filename;

    // 3. Iniciar la descarga
    const result = await FileSystem.downloadAsync(ex.audioUrl, localUri);
    // result.uri contendrá la URI absoluta local
    if (result?.uri) {
      // 4. Actualizar el mapa en SecureStore
      const map = await getDownloadedMap();
      map[ex.id] = result.uri;
      await saveDownloadedMap(map);
      return result.uri;
    } else {
      throw new Error("Descarga no devolvió URI válida");
    }
  } catch (error) {
    console.error("Error descargando ejercicio:", error);
    throw error;
  }
}

/**
 * Elimina un ejercicio descargado (borra el archivo local y actualiza el mapa).
 * @param exerciseId El ID del ejercicio que queremos borrar.
 */
export async function removeDownloadedExercise(
  exerciseId: number
): Promise<void> {
  try {
    const map = await getDownloadedMap();
    const localUri = map[exerciseId];
    if (localUri) {
      // 1. Borrar el archivo local
      await FileSystem.deleteAsync(localUri, { idempotent: true });
      // 2. Eliminar la entrada del mapa y guardarlo
      delete map[exerciseId];
      await saveDownloadedMap(map);
    }
  } catch (error) {
    console.error("Error eliminando ejercicio descargado:", error);
  }
}
