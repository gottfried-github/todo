import { useDispatch } from 'react-redux'
import styled from '@emotion/styled'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'

import { updateStatus, updateName, deleteOne } from '../actions'

import { ITEM_STATUS } from '../constants'

import classes from './Item.module.css'

export default function Item({ item, isEditing, handleEdit }) {
  const dispatch = useDispatch()

  const handleNameChange = ev => {
    // for .isComposing see https://developer.mozilla.org/en-US/docs/Web/API/Element/keyup_event
    if (ev.isComposing || ev.code !== 'Enter') return

    dispatch(
      updateName({
        id: item.id,
        name: ev.target.value,
      })
    )

    handleEdit(item.id)
  }

  const handleStatusChange = () => {
    const status = item.status === ITEM_STATUS.DONE ? ITEM_STATUS.NOT_DONE : ITEM_STATUS.DONE

    dispatch(
      updateStatus({
        id: item.id,
        status,
      })
    )
  }

  const handleDelete = () => {
    dispatch(deleteOne(item.id))
  }

  const handleEditListener = () => {
    handleEdit(item.id)
  }

  const labelClassName = item.status === ITEM_STATUS.DONE ? classes.checked : ''

  return (
    <li className={classes.root}>
      <div className={classes.inputContainer}>
        <input
          id={item.id}
          className={classes.inputCheckbox}
          type="checkbox"
          checked={item.status === ITEM_STATUS.DONE}
          onChange={handleStatusChange}
        />
        {isEditing ? (
          <TextFieldStyled
            type="text"
            variant="filled"
            fullWidth
            defaultValue={item.name}
            onKeyUp={handleNameChange}
          />
        ) : (
          <label className={labelClassName} htmlFor={item.id}>
            {item.name}
          </label>
        )}
      </div>
      <Button variant="base" onClick={handleEditListener}>
        edit
      </Button>
      <Button variant="base" onClick={handleDelete}>
        delete
      </Button>
    </li>
  )
}

const TextFieldStyled = styled(TextField)`
  & .MuiFilledInput-root {
    background-color: ${props => props.theme.palette.backgrounds.main};

    & .MuiFilledInput-input {
      padding: 0;
    }
  }

  & .MuiFilledInput-root.Mui-focused {
    background-color: rgba(0, 0, 0, 0.06);
  }
`
