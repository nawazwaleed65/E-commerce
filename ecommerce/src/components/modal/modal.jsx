
import { Fragment, useState } from "react";

export default function Modal() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="  text-center rounded-lg text-white font-bold">
        <button
          type="button"
          onClick={openModal}
          className="w-full  bg-violet-600 py-2 text-center rounded-lg text-white font-bold bg-green-600"
        >
          Buy Now
        </button>
      </div>

      
    </>
  );
}
