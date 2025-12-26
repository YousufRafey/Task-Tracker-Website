import React, { useState } from 'react';
import { X, Calendar, FileText, Upload, Check, AlertCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { cn } from '../lib/utils'; // Assuming utils exists

const TaskDetailsModal = ({ task, onClose }) => {
    const { submitTask } = useData();
    const [submitting, setSubmitting] = useState(false);
    const [file, setFile] = useState(null);

    const handleSubmit = async () => {
        if (!file) return;
        setSubmitting(true);
        try {
            // Mock file upload content
            await submitTask(task.id, {
                fileName: file.name,
                fileSize: file.size,
                url: URL.createObjectURL(file) // temporary local blob
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">{task.title}</h2>
                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <Calendar size={16} />
                            Due: {new Date(task.deadline).toLocaleDateString()} with time
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{task.description}</p>
                    </div>

                    {task.attachments && task.attachments.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-2">Attachments</h3>
                            <div className="space-y-2">
                                {/* Mock attachment display */}
                                {task.attachments.map((att, i) => (
                                    <div key={i} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <FileText size={16} className="text-gray-400 mr-3" />
                                        <span className="text-sm text-gray-700">Attachment {i + 1}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission</h3>

                        {task.status === 'Completed' || task.status === 'Late Submission' ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center text-green-700">
                                <Check size={20} className="mr-3" />
                                <div>
                                    <p className="font-medium">Task Submitted</p>
                                    <p className="text-sm opacity-90">Great job! You have completed this task.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition text-center cursor-pointer relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                    <Upload className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                                    <p className="text-sm font-medium text-gray-900">
                                        {file ? file.name : "Click to upload work file"}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {file ? `${(file.size / 1024).toFixed(1)} KB` : "Any file format accepted"}
                                    </p>
                                </div>

                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={onClose}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={!file || submitting}
                                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
                                    >
                                        {submitting ? 'Submitting...' : 'Mark as Completed'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;
