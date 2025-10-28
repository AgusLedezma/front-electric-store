import { userService } from '../../../../adapters/api/userService'

/**
 * @param {number} id
 */
export async function deleteUser(id) {
  return userService.remove(id)
}
