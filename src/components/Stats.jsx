export default function Stats({ completed }) {
    return (
      <div className="text-center mt-4 text-sm text-gray-500">
        Completed Sessions: <strong>{completed}</strong>
      </div>
    );
  }
  