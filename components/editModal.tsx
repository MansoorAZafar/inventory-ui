"use client"
import { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Manrope } from "next/font/google";
import { CircleDollarSign, HandCoins, Barcode } from "lucide-react";

const manrope = Manrope({ subsets: ['latin'] });

type EditModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: {
    id?: string;
    name?: string;
    quantity?: number;
    price?: number;
    [key: string]: any;
  } | null;
  onSave: (updated: { quantity: number; price: number }) => void;
};

export default function EditModal({ isOpen, setIsOpen, item, onSave }: EditModalProps) {
  const [quantity, setQuantity] = useState<number>(item?.quantity ?? 0);
  const [price, setPrice] = useState<number>(item?.price ?? 0);

  useEffect(() => {
    setQuantity(item?.quantity ?? 0);
    setPrice(item?.price ?? 0);
  }, [item]);

  const handleSave = () => {
    onSave({ quantity, price });
    setIsOpen(false);
  };

  return (
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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-gray-50 p-6 shadow-xl transition-all">
                <Dialog.Title className="text-center text-xl font-semibold text-gray-900">
                  Edit Item: {item?.name || "Unknown"}
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Barcode className="inline mr-2" />
                      ID: {item?.id}
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <HandCoins className="inline mr-2" />
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                      min={0}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <CircleDollarSign className="inline mr-2" />
                      Price
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={e => setPrice(Number(e.target.value))}
                      className="w-full p-2 border rounded"
                      min={0}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors duration-200"
                  >
                    Save
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
  );
}