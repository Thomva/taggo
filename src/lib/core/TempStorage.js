/**
 * Temporary Storage
 *
 * @author Thomas Van de Velde <thomvand26@student.arteveldehs.be>
 */

export default class TempStorage {
  getItem(key) {
    return sessionStorage.getItem(key);
  }

  setItem(key, value) {
    sessionStorage.setItem(key, value);
  }

  deleteItem(key) {
    sessionStorage.removeItem(key);
  }
}
