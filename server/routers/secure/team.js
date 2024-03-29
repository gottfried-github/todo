import Router from '@koa/router'
import { validateBody } from '../../middleware/common.js'

import create from '../../controllers/secure/team/create.js'
import deleteTeam from '../../controllers/secure/team/delete.js'
import addUser from '../../controllers/secure/team/addUser.js'
import deleteUser from '../../controllers/secure/team/deleteUser.js'
import get from '../../controllers/secure/team/get.js'
import users from '../../controllers/secure/team/users.js'

const router = new Router()

router.post('/', validateBody, create)
router.delete('/:teamId', deleteTeam)
router.post('/:teamId/users/:userId', addUser)
router.delete('/:teamId/users/:userId', deleteUser)
router.get('/users', users)
router.get('/:teamId', get)

export default router
