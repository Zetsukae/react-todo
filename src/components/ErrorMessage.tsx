import './styles/ErrorMessage.css';

type ErrorMessageProps = {
  message: string | null;
  onDismiss: () => void;
};

const ErrorMessage = ({ message, onDismiss }: ErrorMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <div className="error-message" role="alert">
      <span className="error-message-icon" aria-hidden="true">
        !
      </span>
      <p>{message}</p>
      <button
        type="button"
        aria-label="Dismiss error message"
        onClick={onDismiss}
      >
        ×
      </button>
    </div>
  );
};

export default ErrorMessage;
