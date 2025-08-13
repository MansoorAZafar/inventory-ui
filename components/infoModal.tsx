"use client"
import { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Manrope } from "next/font/google"
import {CircleDollarSign} from 'lucide-react'
import {HandCoins} from 'lucide-react'
import {Barcode} from "lucide-react";

const manrope = Manrope({ subsets: ['latin'] })

type InfoModalProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  item: {
    id?: string;
    name?: string;
    quantity?: number;
    price?: number;
    [key: string]: any;
  } | null;
};

export default function InfoModal({ isOpen, setIsOpen , item}: InfoModalProps) {

  return (
    <>
      {/* Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsOpen(false)}>
          {/* Overlay */}
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

          {/* Modal container */}
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
                {/* Modal content box */}
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-lg bg-gray-50 p-6 shadow-xl transition-all">
                  {/* Close button */}
                  <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                    onClick={() => setIsOpen(false)}
                  >
                  </button>

                  {/* Title */}
                  <Dialog.Title className="text-center text-xl font-semibold text-gray-900">
                    {item?.name || "Modal Title"}
                  </Dialog.Title>

                  {/* Content */}
                  <div className="mt-2 p-2">
                    <p className="mb-1text-sm text-gray-500 font-semibold">
                        <Barcode className="inline mr-2" />
                      ID: {item?.id}<br />
                    <CircleDollarSign className="inline mr-2" />
                    Price: {item?.price}.<br />
                    <HandCoins className="inline mr-2" />
                    Quantity: {item?.quantity}<br />
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-2 flex justify-center">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
