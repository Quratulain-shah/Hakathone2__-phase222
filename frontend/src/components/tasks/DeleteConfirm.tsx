'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';

/**
 * DeleteConfirm props interface
 */
interface DeleteConfirmProps {
  taskTitle: string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

/**
 * DeleteConfirm component
 * Client Component modal for confirming task deletion
 * Shows warning and requires explicit confirmation
 */
export function DeleteConfirm({ taskTitle, onConfirm, onClose }: DeleteConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Handle confirmation
   */
  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      // Parent handles closing the modal on success
    } catch (err) {
      // Parent handles error toast
      console.error('Failed to delete task:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  /**
   * Handle Escape key press
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isDeleting) {
      onClose();
    }
  };

  return (
    <Modal isOpen onClose={isDeleting ? undefined : onClose}>
      <div
        className="w-full max-w-md text-center"
        onKeyDown={handleKeyDown}
        role="alertdialog"
        aria-labelledby="delete-title"
        aria-describedby="delete-description"
      >
        {/* Warning Icon */}
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>

        {/* Modal Header */}
        <h2
          id="delete-title"
          className="mb-2 text-xl font-bold text-gray-900"
        >
          Delete Task?
        </h2>

        {/* Modal Description */}
        <p id="delete-description" className="mb-6 text-sm text-gray-600">
          Are you sure you want to delete{' '}
          <span className="font-semibold">&quot;{taskTitle}&quot;</span>? This action
          cannot be undone.
        </p>

        {/* Form Actions */}
        <div className="flex justify-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </>
            ) : (
              'Delete Task'
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
