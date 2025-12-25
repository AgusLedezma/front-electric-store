// Domain entity: User (moved under modules/users)
// Fields: id, ci (Carnet de Identidad), name, role, email

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} ci
 * @property {string} name
 * @property {"Administrador"|"Prevendedor"|"Transportista"} role
 * @property {string} sucursal
 * @property {string} email
 */

export function makeUser(data = {}) {
  return {
    id: data.id ?? 0,
    ci: data.ci ?? "",
    name: data.name ?? "",
    role: data.role ?? "Prevendedor",
    sucursal: data.sucursal ?? "",
    email: data.email ?? "",
  }
}
