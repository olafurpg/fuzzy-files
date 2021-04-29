import React, { useEffect } from "react";
import { LinuxFiles } from "./LinuxFiles";
import { FuzzyFiles } from "./FuzzyFiles";

interface ModalProps {
  show: boolean;
  onClose: () => void;
}

export const Modal: React.FunctionComponent<ModalProps> = (props) => {
  useEffect(() => {
    function onEscape(e: KeyboardEvent) {
      console.log(e.key);
      if ((e.charCode || e.keyCode) === 27) {
        props.onClose();
      }
    }
    document.body.addEventListener("keydown", onEscape);
    return function cleanup() {
      document.body.removeEventListener("keydown", onEscape);
    };
  }, [props]);
  if (!props.show) {
    return null;
  }

  return (
    <div className="modal" onClick={props.onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">Files</h4>
        </div>
        <div className="modal-body">
          <FuzzyFiles files={LinuxFiles} />
        </div>
        <div className="modal-footer">
          <button className="button" onClick={props.onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
