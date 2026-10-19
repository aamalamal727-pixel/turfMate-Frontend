/* eslint-disable react-refresh/only-export-components */
import { Toaster, toast } from 'sonner'

function Toast({ position }) {
  return <Toaster position={position} />
}

Toast.success = (message) => toast.success(message)
Toast.error = (message) => toast.error(message)
Toast.info = (message) => toast.info(message)

export { toast }
export default Toast