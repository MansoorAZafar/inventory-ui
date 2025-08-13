"use client"
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { Manrope } from "next/font/google";
import { Trash2 } from "lucide-react";

const manrope = Manrope({ subsets: ['latin'] });

type DeleteModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: { id?: string; name?: string } | null;
  onDelete: () => Promise<void>;
};

export default function DeleteModal({ isOpen, setIsOpen, item, onDelete }: DeleteModalProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    await onDelete();
    setIsOpen(false);
    setShowConfirm(true);
    setTimeout(() => {
      setShowConfirm(false);
    }, 1500);
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
                  <Dialog.Title className="text-center text-xl font-semibold text-gray-900">
                    <Trash2 className="inline mr-2 text-red-600" />
                    Delete Item
                  </Dialog.Title>
                  <div className="mt-4 text-center">
                    <p className="text-lg font-medium text-gray-700">
                      Are you sure you want to delete <span className="font-bold text-red-600">{item?.name}</span>?
                    </p>
                  </div>
                  <div className="mt-6 flex justify-center gap-2">
                    <button
                      onClick={handleDelete}
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {showConfirm && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50">
          Item deleted!
        </div>
      )}
    </>
  );
}