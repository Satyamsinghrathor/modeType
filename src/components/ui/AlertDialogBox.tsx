

interface AlertDialogBoxProps {
  description: string;
  onCancel: () => void;
  onSubmit: () => void;
}

function AlertDialogBox({
  description,
  onCancel,
  onSubmit,
}: AlertDialogBoxProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="
          w-[90%]
          max-w-md
          rounded-xl
          border
          border-[var(--border)]
          bg-[var(--bg-secondary)]
          p-6
          shadow-2xl
        "
      >
        {/* Description */}
        <p className="text-base leading-6 text-[var(--text-primary)]">
          {description}
        </p>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="
              rounded-lg
              border
              border-[var(--border)]
              bg-[var(--bg-tertiary)]
              px-4
              py-2
              text-sm
              font-medium
              text-[var(--text-secondary)]
              transition
              hover:bg-[var(--bg-elevated)]
              hover:text-[var(--text-primary)]
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            className="
              rounded-lg
              bg-[var(--accent)]
              px-4
              py-2
              text-sm
              font-medium
              text-white
              transition
              hover:opacity-90
            "
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default AlertDialogBox;
