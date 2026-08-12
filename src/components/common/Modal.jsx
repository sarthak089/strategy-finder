export default function Modal({ title, onClose, children }) {
  return (
    <div className="sf-modal-overlay">
      <div className="sf-modal">
        <div className="sf-modal-head">
          <h2 className="sf-modal-title">
            <span className="sf-modal-mark">⟋</span> {title}
          </h2>
          <button onClick={onClose} className="sf-modal-close" aria-label="Close">×</button>
        </div>
        <div className="sf-modal-body">{children}</div>
      </div>
    </div>
  )
}
