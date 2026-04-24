export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-start justify-center z-50 pt-10">
      <div className="bg-[#1a2a35] rounded-lg w-[95vw] max-w-5xl overflow-hidden">
        <div className="bg-[#2a7b9b] px-5 py-3 flex justify-between items-center">
          <h2 className="text-white text-base font-medium">{title}</h2>
          <button onClick={onClose} className="text-white text-xl leading-none cursor-pointer">
            ×
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}