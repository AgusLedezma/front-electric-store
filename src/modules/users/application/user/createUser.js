import { userService } from '../../../../adapters/api/userService'

/**
 * @param {{ ci: string; name: string; email: string; role: string; password?: string }} data
 */
export async function createUser(data) {
  // NOTE: password is only used when creating
  return userService.create(data)
}
