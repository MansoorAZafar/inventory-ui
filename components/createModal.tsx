"use client"
import { useEffect,useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Manrope } from "next/font/google";
import { BadgePlus, CircleDollarSign, HandCoins } from "lucide-react";

const manrope = Manrope({ subsets: ['latin'] });

type CreateModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onCreate: (item: { name: string; price: number; quantity: number }) => Promise<void>;
};

export default function CreateModal({ isOpen, setIsOpen, onCreate }: CreateModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [touched, setTouched] = useState(false);

  const isNameInvalid = touched && name.trim() === "";

  const handleCreate = async () => {
    await onCreate({ name, price, quantity });
    setName("");
    setPrice(0);
    setQuantity(0);
    setIsOpen(false);
  };
  //this useeffect resets fields when modal closed
  useEffect(() => {
  if (!isOpen) {
    setTouched(false);
    setName("");
    setPrice(0);
    setQuantity(0);
  }
}, [isOpen]);

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
                  <BadgePlus className="inline mr-2" />
                  Create New Item
                </Dialog.Title>
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        onBlur={() => setTouched(true)}
                        className={`w-full p-2 border rounded ${isNameInvalid ? "border-red-500 bg-red-50" : ""}`}
                        required
                    />
                    {isNameInvalid && (
                        <p className="text-red-600 text-sm mt-1">Name is required.</p>
                    )}
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
                      required
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
                      required
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-center gap-2">
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                  >
                    Create
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