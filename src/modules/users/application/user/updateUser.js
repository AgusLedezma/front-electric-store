import { userService } from '../../../../adapters/api/userService'

/**
 * @param {number} id
 * @param {{ ci: string; name: string; email: string; role: string }} data
 */
export async function updateUser(id, data) {
  return userService.update(id, data)
}
