import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function Modal({ children, open, onClose, className = '' }) {
  const dialog = useRef();

  useEffect(() => {
    const modal = dialog.current;
    if (open) {
      modal.showModal();
    }
   //clean up function to close the dialog
   return () => modal.close();

  }, [open]);

  return createPortal(
    <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>{children}</dialog>,
    document.getElementById("modal")
  );
}

//onClose prop to close model by pressing Esc key