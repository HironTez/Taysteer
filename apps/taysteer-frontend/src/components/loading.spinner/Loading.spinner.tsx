import './Loading.spinner.sass';

export const Loading: React.FC = () => {
  return (
    <div className='loading-spinner'>
      <svg viewBox="0 0 100 100">
        <circle className="spinner" cx="50" cy="50" r="45" />
      </svg>
    </div>
  );
};
