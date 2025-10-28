import { userService } from '../../../../adapters/api/userService'

export async function getAllUsers() {
  return userService.getAll()
}
