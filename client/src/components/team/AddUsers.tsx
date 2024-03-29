import styled from '@emotion/styled'
import Paper from '@mui/material/Paper'
import Modal from '@mui/material/Modal'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'

import type { UserData } from '../../store/types/common'
import { useAppDispatch, useAppSelector } from '../../hooks/react-redux'
import { creators as actionCreators } from '../../store/actions/team'
import selectors from '../../store/selectors/team'

interface Props {
  users: UserData[]
  isModalOpen: boolean
  modalCloseCb: () => void
}

export default function AddUsers({ users, isModalOpen, modalCloseCb }: Props) {
  const dispatch = useAppDispatch()

  const members = useAppSelector(state => selectors.selectMembers(state))

  const handleToggleUser = (user: UserData, checked: boolean) => {
    if (!checked) {
      return dispatch(actionCreators.sagaDeleteUser(user))
    }

    dispatch(actionCreators.sagaAddUser(user))
  }

  return (
    <ModalStyled open={isModalOpen} onClose={modalCloseCb}>
      <PaperStyled elevation={8}>
        <List>
          {users.map(user => (
            <ListItem key={user.id} disablePadding>
              <ListItemButton
                role={undefined}
                dense
                onClick={() => {
                  handleToggleUser(user, !members.map(member => member.id).includes(user.id))
                }}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={members.map(member => member.id).includes(user.id)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': user.id }}
                  />
                </ListItemIcon>
                <ListItemText id={user.id} primary={user.userName} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </PaperStyled>
    </ModalStyled>
  )
}

const ModalStyled = styled(Modal)`
  display: flex;
  margin: 15px;
`

const PaperStyled = styled(Paper)`
  width: 600px;
  height: max-content;
  padding: 15px;
  margin: auto;
`
