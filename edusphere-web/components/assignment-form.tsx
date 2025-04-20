import { useState, useEffect, ChangeEvent, FormEvent } from 'react';

type AddAssignmentFormProps = {
  onClose: () => void;
};

type BranchData = {
  branches: string[];
};

const AddAssignmentForm = ({ onClose }: AddAssignmentFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [branch, setBranch] = useState('');
  const [year, setYear] = useState('');
  const [section, setSection] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [branches, setBranches] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchBranchData = async () => {
      try {
        const res = await fetch('/api/assignment/branch');
        const data: BranchData = await res.json();
        setBranches(data.branches);
      } catch (error) {
        setErrorMsg('Error fetching branch data');
      }
    };
    fetchBranchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('dueDate', dueDate);
    formData.append('branch', branch);
    formData.append('year', year);
    formData.append('section', section);
    if (file) formData.append('file', file);

    try {
      const res = await fetch('/api/assignment/create', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Failed to create assignment');
      }

      onClose();
    } catch (error: any) {
      setErrorMsg(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Assignment</h2>
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Due Date</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Branch</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              required
            >
              <option value="">Select Branch</option>
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Year</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Section</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={section}
              onChange={(e) => setSection(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Upload File</label>
            <input
              type="file"
              className="w-full p-2 border border-gray-300 rounded"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFile(e.target.files?.[0] || null)
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
            </button>
            <button
              type="button"
              className="text-gray-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignmentForm;
