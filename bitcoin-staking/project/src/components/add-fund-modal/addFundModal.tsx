import { useRouter } from "next/navigation";
import { FC } from "react";
import Modal from "../modal/modal";
import { playButtonAudio } from "@/sound";

interface AddFundModalProps {
  show: boolean;
  handleModal: () => void;
}

const AddFundModal:FC<AddFundModalProps> = ({ show, handleModal }) => {
  const router = useRouter();
  
  return(
    <Modal customClass={'flip-modal'} show={show} handleModal={handleModal}>
      <h1 className="heading-primary">You need ΛRC to play</h1>
        <button className="btn-arrow bg-transparent mt-30 mx-auto" onClick={() => {
          playButtonAudio();
          router.push('/exchange')}}>
          Add funds
          <img className="btn-arrow__icon" src="/static/svgs/arrow-right.svg" alt="arrow icon" />
        </button>
    </Modal>
  )
}

export default AddFundModal;